import { TypedEventTarget } from '../TypedEventTarget.js';
import {
  BRIDGE_NAMESPACE,
  isHostMessage,
  type BridgeRequestType,
  type BridgeResult,
  type BridgeScormVersion,
  type ClientMessage,
  type HostMessage,
} from './protocol.js';

import type { IScorm1_2, IScorm2004 } from '../ScormInstance.js';

export interface ConnectToScormHostOptions {
  /** LMS origins allowed to act as the host, or a predicate. `'*'` is rejected. */
  allowedOrigins: string[] | ((origin: string) => boolean);
  /** Window running the host. @default window.parent */
  target?: Window;
  /** Milliseconds to wait for the handshake and for each acknowledgement. @default 10000 */
  timeout?: number;
  /** Milliseconds between handshake attempts while the host is still loading. @default 250 */
  retryInterval?: number;
  /** Extra data-model elements to cache on connect so they can be read synchronously. */
  preload?: string[];
}

export interface ScormBridgeError extends Omit<BridgeResult, 'ok'> {
  type: BridgeRequestType;
  element?: string;
  value?: string;
}

type BridgeEvents = { error: ScormBridgeError };
type Request =
  { type: 'get'; element: string } | { type: 'set'; element: string; value: string } | { type: 'commit' | 'terminate' };
type ReadyMessage = Extract<HostMessage, { type: 'ready' }>;
type ResultMessage = Extract<HostMessage, { type: 'result' }>;

export class ScormBridgeConnectionError extends Error {
  constructor(
    message: string,
    readonly result?: BridgeResult,
  ) {
    super(message);
    this.name = 'ScormBridgeConnectionError';
  }
}

/**
 * Client end of the bridge: a SCORM API object backed by postMessage.
 * Reads come from a cache filled on connect; writes update the cache and are sent
 * to the host, with failures reported through the `error` event.
 */
export class ScormBridge {
  readonly version: BridgeScormVersion;
  /** Host window origin verified during the handshake. */
  readonly origin: string;
  /** Pass to `useScorm({ api })` or `new ScormInstance({ api })`. */
  readonly api: IScorm1_2 | IScorm2004;

  private readonly target: Window;
  private readonly timeout: number;
  private readonly cache: Map<string, string>;
  private readonly events = new TypedEventTarget<BridgeEvents>();
  private readonly pending = new Map<number, { promise: Promise<ResultMessage>; settle: (m: ResultMessage) => void }>();
  private readonly errorStrings = new Map<string, string>();
  private state: 'ready' | 'active' | 'terminated' | 'disconnected' = 'ready';
  private nextId = 1;
  private lastError = '0';
  private lastDiagnostic = '';
  private failedSinceFlush = false;

  constructor(target: Window, origin: string, ready: ReadyMessage, timeout: number) {
    if (!ready.version) throw new ScormBridgeConnectionError('Host did not report a SCORM version.');

    this.target = target;
    this.origin = origin;
    this.timeout = timeout;
    this.version = ready.version;
    this.cache = new Map(Object.entries(ready.snapshot));

    const initialize = () => {
      if (this.state !== 'ready') return this.fail(this.version === '1.2' ? '101' : '103', 'Already initialized.');

      this.state = 'active';
      return this.succeed();
    };
    const terminate = () => {
      if (this.state !== 'active') return this.inactive('terminate');

      this.state = 'terminated';
      this.send({ type: 'terminate' });
      return this.succeed();
    };
    const getValue = (element: string) => {
      if (this.state !== 'active') {
        this.inactive('get');
        return '';
      }

      if (!this.cache.has(element)) {
        this.fail('101', `"${element}" was not cached by the bridge; use getValueAsync() or the preload option.`);
        return '';
      }

      this.succeed();
      return this.cache.get(element) as string;
    };
    const setValue = (element: string, value: string) => {
      if (this.state !== 'active') return this.inactive('set');

      this.cache.set(element, String(value));
      this.bumpCounts(element);
      this.send({ type: 'set', element, value: String(value) });
      return this.succeed();
    };
    const commit = () => {
      if (this.state !== 'active') return this.inactive('commit');

      this.send({ type: 'commit' });
      return this.succeed();
    };
    const getLastError = () => this.lastError;
    const getErrorString = (code: string) => this.errorStrings.get(String(code)) ?? '';
    const getDiagnostic = () => this.lastDiagnostic;

    this.api =
      this.version === '1.2'
        ? {
            LMSInitialize: initialize,
            LMSFinish: terminate,
            LMSGetValue: getValue,
            LMSSetValue: setValue,
            LMSCommit: commit,
            LMSGetLastError: getLastError,
            LMSGetErrorString: getErrorString,
            LMSGetDiagnostic: getDiagnostic,
          }
        : {
            Initialize: initialize,
            Terminate: terminate,
            GetValue: getValue,
            SetValue: setValue,
            Commit: commit,
            GetLastError: getLastError,
            GetErrorString: getErrorString,
            GetDiagnostic: getDiagnostic,
          };

    window.addEventListener('message', this.onMessage);
  }

  /** Read any element straight from the LMS, bypassing (and refreshing) the cache. */
  async getValueAsync(element: string): Promise<string> {
    if (this.state !== 'active') throw new Error('The SCORM session is not active.');

    const result = await this.send({ type: 'get', element });

    if (!result.ok) throw new Error(result.diagnostic || result.errorString || `SCORM error ${result.errorCode}`);

    this.cache.set(element, result.value ?? '');
    return result.value ?? '';
  }

  /** Wait for every outstanding acknowledgement; resolves `false` if anything failed since the last flush. */
  async flush(): Promise<boolean> {
    await Promise.all(Array.from(this.pending.values(), ({ promise }) => promise));

    const ok = !this.failedSinceFlush;
    this.failedSinceFlush = false;

    return ok;
  }

  /** Stop listening for host messages. The LMS session is left to the host. */
  disconnect() {
    this.state = 'disconnected';
    window.removeEventListener('message', this.onMessage);
  }

  addEventListener<K extends keyof BridgeEvents>(
    event: K,
    callback: (event: CustomEvent<BridgeEvents[K]>) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.events.addEventListener(event, callback, options);
  }

  removeEventListener<K extends keyof BridgeEvents>(
    event: K,
    callback: (event: CustomEvent<BridgeEvents[K]>) => void,
    options?: boolean | EventListenerOptions,
  ) {
    this.events.removeEventListener(event, callback, options);
  }

  private readonly onMessage = (event: MessageEvent) => {
    if (event.source !== this.target || event.origin !== this.origin || !isHostMessage(event.data)) return;
    if (event.data.type !== 'result') return;

    this.pending.get(event.data.id)?.settle(event.data);
  };

  private send(request: Request): Promise<ResultMessage> {
    const id = this.nextId++;
    let settle!: (message: ResultMessage) => void;

    const promise = new Promise<ResultMessage>((resolve) => {
      const timer = setTimeout(
        () =>
          settle({
            ns: BRIDGE_NAMESPACE,
            id,
            type: 'result',
            ok: false,
            errorCode: '101',
            errorString: 'General exception',
            diagnostic: 'The SCORM host did not respond in time.',
          }),
        this.timeout,
      );

      settle = (message) => {
        clearTimeout(timer);
        this.pending.delete(id);

        if (message.errorString) this.errorStrings.set(message.errorCode, message.errorString);
        if (!message.ok) {
          this.failedSinceFlush = true;
          const { errorCode, errorString, diagnostic } = message;
          this.events.dispatchEvent('error', { ...request, errorCode, errorString, diagnostic } as ScormBridgeError);
        }

        resolve(message);
      };
    });

    this.pending.set(id, { promise, settle });
    this.target.postMessage({ ns: BRIDGE_NAMESPACE, id, ...request } as ClientMessage, this.origin);

    return promise;
  }

  /** Keep `_count` values in step with writes such as `cmi.interactions.3.id`. */
  private bumpCounts(element: string) {
    const parts = element.split('.');

    parts.forEach((part, index) => {
      if (index === 0 || !/^\d+$/.test(part)) return;

      const key = [...parts.slice(0, index), '_count'].join('.');
      const count = Number(part) + 1;

      if (Number(this.cache.get(key) ?? 0) < count) this.cache.set(key, String(count));
    });
  }

  private succeed() {
    this.lastError = '0';
    this.lastDiagnostic = '';
    return 'true';
  }

  private fail(code: string, diagnostic: string) {
    this.lastError = code;
    this.lastDiagnostic = diagnostic;
    if (!this.errorStrings.has(code)) this.errorStrings.set(code, diagnostic);
    return 'false';
  }

  /** Report the version-appropriate "not initialized" / "already terminated" error. */
  private inactive(action: BridgeRequestType) {
    if (this.version === '1.2') return this.fail('301', 'Not initialized.');

    const terminated = this.state === 'terminated' || this.state === 'disconnected';
    const codes: Record<BridgeRequestType, [string, string]> = {
      get: ['122', '123'],
      set: ['132', '133'],
      commit: ['142', '143'],
      terminate: ['112', '113'],
    };

    return this.fail(codes[action][terminated ? 1 : 0], terminated ? 'Session terminated.' : 'Not initialized.');
  }
}

/**
 * Handshake with a `createScormHost` running in the parent SCORM package.
 * Resolves with a bridge whose `api` can be passed to `useScorm`.
 */
export function connectToScormHost({
  allowedOrigins,
  target = window.parent,
  timeout = 10000,
  retryInterval = 250,
  preload,
}: ConnectToScormHostOptions): Promise<ScormBridge> {
  if (Array.isArray(allowedOrigins) && allowedOrigins.includes('*')) {
    return Promise.reject(new ScormBridgeConnectionError('"*" is not a valid allowed origin.'));
  }

  if (!target || target === window) {
    return Promise.reject(new ScormBridgeConnectionError('The course is not running inside a SCORM host frame.'));
  }

  const isAllowed =
    typeof allowedOrigins === 'function' ? allowedOrigins : (origin: string) => allowedOrigins.includes(origin);

  return new Promise((resolve, reject) => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      clearInterval(interval);
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== target || !isAllowed(event.origin) || !isHostMessage(event.data)) return;
      if (event.data.type !== 'ready') return;

      cleanup();

      const { ok, errorCode, errorString, diagnostic } = event.data;

      if (!ok) {
        reject(
          new ScormBridgeConnectionError(diagnostic || errorString || `SCORM error ${errorCode}`, {
            ok,
            errorCode,
            errorString,
            diagnostic,
          }),
        );
        return;
      }

      try {
        resolve(new ScormBridge(target, event.origin, event.data, timeout));
      } catch (error) {
        reject(error);
      }
    };

    // The connect message carries no learner data, so it is safe to send before the host origin is known.
    const post = () => target.postMessage({ ns: BRIDGE_NAMESPACE, id: 0, type: 'connect', preload }, '*');

    window.addEventListener('message', onMessage);
    timer = setTimeout(() => {
      cleanup();
      reject(new ScormBridgeConnectionError('Timed out waiting for the SCORM host.'));
    }, timeout);
    interval = setInterval(post, retryInterval);
    post();
  });
}
