import { renderHook } from '@testing-library/react';

import useScorm, { ScormInstance, type IScorm1_2, type IScorm2004, type IScormClass } from './index.js';

function useVerifyVersionSpecificTypes() {
  const scorm12 = useScorm({ version: '1.2' });
  scorm12.get('cmi.core.lesson_status');
  // @ts-expect-error SCORM 2004 data-model elements are not valid in SCORM 1.2.
  scorm12.get('cmi.completion_status');

  const scorm2004 = useScorm({ version: '2004' });
  scorm2004.status('set', 'completed');
  // @ts-expect-error Success status is separate from SCORM 2004 completion status.
  scorm2004.status('set', 'passed');

  const scormAuto = new ScormInstance({});
  scormAuto.get('cmi.core.lesson_status');
  scormAuto.get('cmi.completion_status');

  const api: IScormClass<'auto'> = scormAuto;
  const controller = new AbortController();
  api.addEventListener(
    'any',
    ({ detail }) => {
      const event: 'init' | 'set' | 'storage' = detail.event;
      const data: unknown = detail.data;
      void [event, data];
    },
    { signal: controller.signal, once: true },
  );
  api.removeEventListener('any', () => {}, { capture: false });
  api.on('set', () => {}, { signal: controller.signal });
  api.onAny(() => {}, { once: true });
  // @ts-expect-error Unknown event names must be rejected.
  api.addEventListener('invalid', () => {});
  // @ts-expect-error Unknown event names must be rejected when removing listeners.
  api.removeEventListener('invalid', () => {});
}

void useVerifyVersionSpecificTypes;

const createScorm12Api = () => {
  const values: Record<string, string> = {
    'cmi.core.lesson_status': 'not attempted',
    'cmi.suspend_data': '',
  };
  const api: IScorm1_2 = {
    LMSInitialize: jest.fn(() => true),
    LMSFinish: jest.fn(() => true),
    LMSGetValue: jest.fn((element) => values[element] ?? ''),
    LMSSetValue: jest.fn((element, value) => {
      values[element] = value;
      return true;
    }),
    LMSCommit: jest.fn(() => true),
    LMSGetLastError: jest.fn(() => '0'),
    LMSGetErrorString: jest.fn(() => ''),
    LMSGetDiagnostic: jest.fn(() => ''),
  };

  return { api, values };
};

const createScorm2004Api = () => {
  const values: Record<string, string> = {
    'cmi.completion_status': 'not attempted',
    'cmi.suspend_data': '',
  };
  const api: IScorm2004 = {
    Initialize: jest.fn(() => true),
    Terminate: jest.fn(() => true),
    GetValue: jest.fn((element) => values[element] ?? ''),
    SetValue: jest.fn((element, value) => {
      values[element] = value;
      return true;
    }),
    Commit: jest.fn(() => true),
    GetLastError: jest.fn(() => '0'),
    GetErrorString: jest.fn(() => ''),
    GetDiagnostic: jest.fn(() => ''),
  };

  return { api, values };
};

describe('ScormInstance', () => {
  afterEach(() => {
    delete window.API;
    delete window.API_1484_11;
  });

  it('remains inactive when no SCORM API is available', () => {
    const scorm = new ScormInstance({});

    expect(scorm.init()).toBe(false);
    expect(scorm.connection.isActive).toBe(false);
  });

  it('detects SCORM 1.2 when auto mode is explicitly selected', () => {
    const { api } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: 'auto', handleCompletionStatus: false });

    expect(scorm.init()).toBe(true);
    expect(scorm.version).toBe('1.2');
    expect(api.LMSInitialize).toHaveBeenCalledWith('');
  });

  it('detects SCORM 2004 and commits a stored value once', () => {
    const { api, values } = createScorm2004Api();
    window.API_1484_11 = api;
    const scorm = new ScormInstance({ handleCompletionStatus: false });

    expect(scorm.init()).toBe(true);
    expect(scorm.version).toBe('2004');
    expect(scorm.store({ completed: true })).toBe(true);
    expect(values['cmi.suspend_data']).toBe('{"completed":true}');
    expect(api.Commit).toHaveBeenCalledTimes(1);
  });

  it('returns false for an unsuccessful LMS boolean result', () => {
    const { api } = createScorm12Api();
    api.LMSInitialize = jest.fn(() => 'false');
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2' });

    expect(scorm.init()).toBe(false);
    expect(scorm.connection.isActive).toBe(false);
  });

  it('commits status updates once when auto-commit is enabled', () => {
    const { api, values } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false });

    expect(scorm.init()).toBe(true);
    expect(scorm.status('set', 'completed')).toBe(true);
    expect(values['cmi.core.lesson_status']).toBe('completed');
    expect(api.LMSCommit).toHaveBeenCalledTimes(1);
  });

  it('initializes a new attempt and commits that status once', () => {
    const { api, values } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2' });

    expect(scorm.init()).toBe(true);
    expect(values['cmi.core.lesson_status']).toBe('incomplete');
    expect(api.LMSCommit).toHaveBeenCalledTimes(1);
  });

  it('reports an exit-mode failure even when LMSFinish succeeds', () => {
    const { api } = createScorm12Api();
    api.LMSSetValue = jest.fn(() => 'false');
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false });

    expect(scorm.init()).toBe(true);
    expect(scorm.terminate()).toBe(false);
    expect(api.LMSFinish).toHaveBeenCalledTimes(1);
    expect(scorm.connection.isActive).toBe(false);
  });

  it('deduplicates native event listeners and delivers CustomEvent payloads', () => {
    const { api } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false, autoCommit: false });
    const listener = jest.fn();
    const anyListener = jest.fn();

    expect(scorm.init()).toBe(true);

    const controller = new AbortController();
    scorm.addEventListener('set', listener);
    scorm.addEventListener('set', listener);
    scorm.addEventListener('any', anyListener, { signal: controller.signal });
    expect(scorm.set('cmi.core.lesson_status', 'incomplete')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(listener.mock.calls[0][0].detail).toEqual({
      parameter: 'cmi.core.lesson_status',
      value: 'incomplete',
    });
    expect(anyListener).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(anyListener.mock.calls[0][0].detail).toEqual({
      event: 'set',
      data: { parameter: 'cmi.core.lesson_status', value: 'incomplete' },
    });

    scorm.removeEventListener('set', listener);
    controller.abort();
    expect(scorm.set('cmi.core.lesson_status', 'completed')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(anyListener).toHaveBeenCalledTimes(1);
  });

  it('aborts a group of runtime and window listeners together', () => {
    const { api } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false, autoCommit: false });
    const controller = new AbortController();
    const listener = jest.fn();
    const anyListener = jest.fn();
    const pageHideListener = jest.fn();

    expect(scorm.init()).toBe(true);

    try {
      const options = { signal: controller.signal };
      scorm.addEventListener('set', listener, options);
      scorm.addEventListener('any', anyListener, options);
      window.addEventListener('pagehide', pageHideListener, options);
      expect(scorm.set('cmi.core.lesson_status', 'incomplete')).toBe(true);
      window.dispatchEvent(new Event('pagehide'));
      expect(listener).toHaveBeenCalledTimes(1);
      expect(anyListener).toHaveBeenCalledTimes(1);
      expect(pageHideListener).toHaveBeenCalledTimes(1);

      controller.abort();
      expect(scorm.set('cmi.core.lesson_status', 'completed')).toBe(true);
      window.dispatchEvent(new Event('pagehide'));
      expect(listener).toHaveBeenCalledTimes(1);
      expect(anyListener).toHaveBeenCalledTimes(1);
      expect(pageHideListener).toHaveBeenCalledTimes(1);
    } finally {
      controller.abort();
    }
  });

  it('does not register listeners whose signal has already aborted', () => {
    const { api } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false, autoCommit: false });
    const controller = new AbortController();
    const listener = jest.fn();

    expect(scorm.init()).toBe(true);
    controller.abort();
    scorm.addEventListener('set', listener, { signal: controller.signal });
    scorm.addEventListener('any', listener, { signal: controller.signal });

    expect(scorm.set('cmi.core.lesson_status', 'completed')).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });

  it('supports single-use runtime and any-event listeners', () => {
    const { api } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false, autoCommit: false });
    const listener = jest.fn();
    const anyListener = jest.fn();

    expect(scorm.init()).toBe(true);
    scorm.addEventListener('set', listener, { once: true });
    scorm.addEventListener('any', anyListener, { once: true });

    expect(scorm.set('cmi.core.lesson_status', 'incomplete')).toBe(true);
    expect(scorm.set('cmi.core.lesson_status', 'completed')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(anyListener).toHaveBeenCalledTimes(1);
  });

  it('keeps the existing event method names as compatible aliases', () => {
    const { api } = createScorm12Api();
    window.API = api;
    const scorm = new ScormInstance({ version: '1.2', handleCompletionStatus: false, autoCommit: false });
    const listener = jest.fn();
    const anyListener = jest.fn();
    const controller = new AbortController();

    expect(scorm.init()).toBe(true);
    scorm.on('set', listener, { signal: controller.signal });
    scorm.onAny(anyListener, { signal: controller.signal });
    expect(scorm.set('cmi.core.lesson_status', 'incomplete')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(anyListener).toHaveBeenCalledTimes(1);

    scorm.removeEventListener('set', listener);
    scorm.removeEventListener('any', anyListener);
    expect(scorm.set('cmi.core.lesson_status', 'completed')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(anyListener).toHaveBeenCalledTimes(1);

    scorm.addEventListener('set', listener);
    scorm.addEventListener('any', anyListener);
    scorm.off('set', listener);
    scorm.offAny(anyListener);
    expect(scorm.set('cmi.core.lesson_status', 'incomplete')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(anyListener).toHaveBeenCalledTimes(1);
    controller.abort();
  });

  it('initializes after mount and terminates when the hook unmounts', () => {
    const { api } = createScorm12Api();
    window.API = api;

    const { result, unmount } = renderHook(() =>
      useScorm({ version: '1.2', handleCompletionStatus: false, handleExitMode: false }),
    );

    expect(result.current.connection.isActive).toBe(true);
    expect(api.LMSInitialize).toHaveBeenCalledTimes(1);

    unmount();

    expect(api.LMSFinish).toHaveBeenCalledTimes(1);
  });
});
