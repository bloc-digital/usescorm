import { ScormInstance, parseBool } from '../ScormInstance.js';
import {
  BRIDGE_NAMESPACE,
  SNAPSHOT_ELEMENTS,
  isClientMessage,
  type BridgeResult,
  type BridgeScormVersion,
  type ClientMessage,
  type HostMessage,
} from './protocol.js';

import type { availableVersions, IScorm1_2, IScorm2004 } from '../ScormInstance.js';

export interface ScormHostOptions {
  /** The iframe that loads the remote course. */
  iframe: HTMLIFrameElement;
  /** Origins the course may be served from. Defaults to the origin of `iframe.src`. */
  allowedOrigins?: string[];
  /** SCORM version to look for. @default 'auto' */
  version?: availableVersions;
  /** Log bridge traffic and API failures. */
  debug?: boolean;
  /** Commit and terminate the session if the wrapper unloads before the course does. @default true */
  terminateOnUnload?: boolean;
  /** When terminating on unload, set an exit mode the course did not set itself. @default true */
  handleExitMode?: boolean;
}

export interface ScormHost {
  /** Detected SCORM version, or `null` until the course connects. */
  readonly version: BridgeScormVersion | null;
  /** Whether the LMS session is currently open. */
  readonly isActive: boolean;
  /** Close the LMS session (if open) as the course would on exit. */
  terminate(): boolean;
  /** Stop listening for course messages and unload events. Does not terminate the session. */
  destroy(): void;
}

/** Normalised view of the two LMS API shapes. */
interface RawApi {
  initialize(): boolean;
  terminate(): boolean;
  getValue(element: string): string;
  setValue(element: string, value: string): boolean;
  commit(): boolean;
  lastError(): string;
  errorString(code: string): string;
  diagnostic(code: string): string;
}

const wrapApi = (api: IScorm1_2 | IScorm2004, version: BridgeScormVersion): RawApi => {
  if (version === '1.2') {
    const scorm = api as IScorm1_2;
    return {
      initialize: () => parseBool(scorm.LMSInitialize('')),
      terminate: () => parseBool(scorm.LMSFinish('')),
      getValue: (element) => String(scorm.LMSGetValue(element as never) ?? ''),
      setValue: (element, value) => parseBool(scorm.LMSSetValue(element as never, value)),
      commit: () => parseBool(scorm.LMSCommit('')),
      lastError: () => String(scorm.LMSGetLastError() ?? '0'),
      errorString: (code) => String(scorm.LMSGetErrorString(code) ?? ''),
      diagnostic: (code) => String(scorm.LMSGetDiagnostic(code) ?? ''),
    };
  }

  const scorm = api as IScorm2004;
  return {
    initialize: () => parseBool(scorm.Initialize('')),
    terminate: () => parseBool(scorm.Terminate('')),
    getValue: (element) => String(scorm.GetValue(element as never) ?? ''),
    setValue: (element, value) => parseBool(scorm.SetValue(element as never, value)),
    commit: () => parseBool(scorm.Commit('')),
    lastError: () => String(scorm.GetLastError() ?? '0'),
    errorString: (code) => String(scorm.GetErrorString(code) ?? ''),
    diagnostic: (code) => String(scorm.GetDiagnostic(code) ?? ''),
  };
};

const failure = (diagnostic: string): BridgeResult => ({
  ok: false,
  errorCode: '101',
  errorString: 'General exception',
  diagnostic,
});

/**
 * Run inside the SCORM package on the LMS: relays postMessage requests from the
 * course iframe to the real LMS API, which the cross-origin course cannot reach.
 */
export function createScormHost({
  iframe,
  allowedOrigins,
  version = 'auto',
  debug = false,
  terminateOnUnload = true,
  handleExitMode = true,
}: ScormHostOptions): ScormHost {
  if (allowedOrigins?.includes('*')) throw new Error('usescorm host: "*" is not a valid allowed origin.');

  let state: 'idle' | 'active' | 'terminated' = 'idle';
  let raw: RawApi | null = null;
  let detectedVersion: BridgeScormVersion | null = null;
  let completionStatus = '';
  let exitSet = false;

  const log = (...message: unknown[]) => {
    if (debug) console.log('[usescorm host]', ...message);
  };

  // Resolved per message so the iframe src can be set after the host is created.
  const getAllowedOrigins = () => {
    if (allowedOrigins) return allowedOrigins;

    const src = iframe.getAttribute('src');

    try {
      return src ? [new URL(src, window.location.href).origin] : [];
    } catch {
      return [];
    }
  };

  const result = (ok: boolean): BridgeResult => {
    if (!raw) return failure('SCORM API not found.');

    const errorCode = raw.lastError();
    const hasError = errorCode !== '0' && errorCode !== '';

    return {
      ok,
      errorCode: errorCode || '0',
      errorString: hasError ? raw.errorString(errorCode) : '',
      diagnostic: hasError ? raw.diagnostic(errorCode) : '',
    };
  };

  const trackValue = (element: string, value: string) => {
    if (element === 'cmi.core.lesson_status' || element === 'cmi.completion_status') completionStatus = value;
    if (element === 'cmi.core.exit' || element === 'cmi.exit') exitSet = true;
  };

  const connect = (): BridgeResult => {
    if (state === 'terminated') return failure('The SCORM session has already been terminated.');
    if (state === 'active') return result(true);

    const finder = new ScormInstance({ version, debug });
    const api = finder.API.get();

    if (!api) return failure('SCORM API not found.');

    detectedVersion = finder.version as BridgeScormVersion;
    raw = wrapApi(api, detectedVersion);

    const outcome = result(raw.initialize());

    if (outcome.ok) {
      state = 'active';
      log(`session initialized (SCORM ${detectedVersion})`);
    }

    return outcome;
  };

  const readSnapshot = (preload: string[] = []) => {
    const snapshot: Record<string, string> = {};

    if (!raw || !detectedVersion) return snapshot;

    for (const element of new Set([...SNAPSHOT_ELEMENTS[detectedVersion], ...preload])) {
      const value = raw.getValue(element);

      if (value !== '' || raw.lastError() === '0') snapshot[element] = value;
    }

    const statusElement = detectedVersion === '1.2' ? 'cmi.core.lesson_status' : 'cmi.completion_status';
    completionStatus = snapshot[statusElement] ?? '';

    return snapshot;
  };

  const handleRequest = (message: Exclude<ClientMessage, { type: 'connect' }>): BridgeResult & { value?: string } => {
    if (state !== 'active' || !raw) return failure('The SCORM session is not active.');

    switch (message.type) {
      case 'get': {
        const value = raw.getValue(message.element);
        const outcome = result(value !== '' || raw.lastError() === '0');

        return { ...outcome, value };
      }
      case 'set': {
        const outcome = result(raw.setValue(message.element, message.value));

        if (outcome.ok) trackValue(message.element, message.value);

        return outcome;
      }
      case 'commit':
        return result(raw.commit());
      case 'terminate': {
        const outcome = result(raw.terminate());

        if (outcome.ok) state = 'terminated';

        return outcome;
      }
    }
  };

  const onMessage = (event: MessageEvent) => {
    const child = iframe.contentWindow;

    if (!child || event.source !== child || !getAllowedOrigins().includes(event.origin)) return;
    if (!isClientMessage(event.data)) return;

    const message = event.data;
    let reply: HostMessage;

    log('received', message);

    if (message.type === 'connect') {
      const outcome = connect();

      reply = {
        ns: BRIDGE_NAMESPACE,
        id: message.id,
        type: 'ready',
        version: detectedVersion,
        snapshot: outcome.ok ? readSnapshot(message.preload) : {},
        ...outcome,
      };
    } else {
      reply = { ns: BRIDGE_NAMESPACE, id: message.id, type: 'result', ...handleRequest(message) };
    }

    log('reply', reply);
    child.postMessage(reply, event.origin);
  };

  const terminate = (): boolean => {
    if (state !== 'active' || !raw) return false;

    if (handleExitMode && !exitSet) {
      const isComplete =
        detectedVersion === '1.2'
          ? completionStatus === 'completed' || completionStatus === 'passed'
          : completionStatus === 'completed';

      if (detectedVersion === '1.2') raw.setValue('cmi.core.exit', isComplete ? 'logout' : 'suspend');
      else raw.setValue('cmi.exit', isComplete ? 'normal' : 'suspend');
    }

    raw.commit();

    const success = raw.terminate();

    if (success) state = 'terminated';
    log(`session terminated by host: ${success}`);

    return success;
  };

  const onUnload = () => void terminate();

  window.addEventListener('message', onMessage);

  if (terminateOnUnload) {
    window.addEventListener('pagehide', onUnload);
    window.addEventListener('beforeunload', onUnload);
  }

  return {
    get version() {
      return detectedVersion;
    },
    get isActive() {
      return state === 'active';
    },
    terminate,
    destroy() {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('pagehide', onUnload);
      window.removeEventListener('beforeunload', onUnload);
    },
  };
}
