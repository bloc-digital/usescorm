import { createContext, useEffect, useRef, useState } from 'react';

import { ScormInstance } from './ScormInstance.js';

import type { IScormProps, IScormClass, availableVersions } from './ScormInstance.js';

export interface IUseScormProps<T extends availableVersions = 'auto'> extends IScormProps<T> {
  /**
   * Commit and terminate the session when the page is hidden for unloading (`pagehide`).
   * Leave this off for courses behind the postMessage bridge: the host handles unloading,
   * and terminating would stop a reloaded course from reconnecting.
   *
   * @default false
   */
  terminateOnUnload?: boolean;
}

/**
 * Open a SCORM session after mount and terminate it on unmount.
 *
 * Options are read once, when the component first renders. The returned instance is
 * stable and mutable: it does not trigger re-renders, so subscribe to its events (or
 * copy values into state) when the UI needs to reflect SCORM data.
 */
export default function useScorm<T extends availableVersions = 'auto'>(props: IUseScormProps<T> = {}) {
  const { terminateOnUnload = false, ...options } = props;
  const [instance] = useState(() => new ScormInstance<T>(options));
  const pendingTerminate = useRef(false);

  useEffect(() => {
    // React StrictMode and Fast Refresh replay effects synchronously (cleanup, then setup).
    // Terminating immediately would end the LMS session for good, so the cleanup only
    // schedules termination and a replayed setup cancels it.
    if (pendingTerminate.current) pendingTerminate.current = false;
    else instance.init();

    const controller = new AbortController();

    if (terminateOnUnload) {
      window.addEventListener(
        'pagehide',
        // terminate() commits first (SCORM 2004's Terminate commits implicitly).
        () => void (instance.connection.isActive && instance.terminate()),
        { signal: controller.signal },
      );
    }

    return () => {
      controller.abort();
      pendingTerminate.current = true;

      queueMicrotask(() => {
        if (!pendingTerminate.current) return;

        pendingTerminate.current = false;
        if (instance.connection.isActive) instance.terminate();
      });
    };
  }, [instance, terminateOnUnload]);

  return instance;
}

export const ScormContext = createContext<IScormClass<'auto'> | null>(null);
