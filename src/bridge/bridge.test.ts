import { ScormInstance, type IScorm1_2, type IScorm2004 } from '../index.js';
import { connectToScormHost, createScormHost, type ScormHost } from './index.js';

const LMS_ORIGIN = 'https://lms.test';
const COURSE_ORIGIN = 'https://course.test';

const createScorm2004Api = () => {
  const values: Record<string, string> = {
    'cmi.completion_status': 'not attempted',
    'cmi.learner_name': 'Ada',
    'cmi.suspend_data': '',
  };
  const api: IScorm2004 = {
    Initialize: jest.fn(() => 'true'),
    Terminate: jest.fn(() => 'true'),
    GetValue: jest.fn((element) => values[element] ?? ''),
    SetValue: jest.fn((element, value) => {
      values[element] = value;
      return 'true';
    }),
    Commit: jest.fn(() => 'true'),
    GetLastError: jest.fn(() => '0'),
    GetErrorString: jest.fn(() => ''),
    GetDiagnostic: jest.fn(() => ''),
  };

  return { api, values };
};

/**
 * jsdom runs host and course in one window, so the iframe's postMessage is routed
 * by message shape: client requests reach the host, host replies reach the client.
 */
const setupFrames = () => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', `${COURSE_ORIGIN}/index.html`);
  document.body.append(iframe);

  const child = iframe.contentWindow as Window;
  const posted: { data: unknown; targetOrigin: string }[] = [];

  jest.spyOn(child, 'postMessage').mockImplementation(((data: unknown, targetOrigin: string) => {
    posted.push({ data, targetOrigin });
    const fromHost = (data as { type?: string }).type === 'ready' || (data as { type?: string }).type === 'result';
    window.dispatchEvent(
      new MessageEvent('message', { data, source: child, origin: fromHost ? LMS_ORIGIN : COURSE_ORIGIN }),
    );
  }) as Window['postMessage']);

  return { iframe, child, posted };
};

describe('postMessage bridge', () => {
  let host: ScormHost | undefined;

  afterEach(() => {
    host?.destroy();
    host = undefined;
    delete window.API;
    delete window.API_1484_11;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('relays a full SCORM 2004 session through ScormInstance', async () => {
    const { api, values } = createScorm2004Api();
    window.API_1484_11 = api;
    const { iframe, child, posted } = setupFrames();
    host = createScormHost({ iframe });

    const bridge = await connectToScormHost({ allowedOrigins: [LMS_ORIGIN], target: child });
    expect(bridge.version).toBe('2004');
    expect(bridge.origin).toBe(LMS_ORIGIN);
    expect(api.Initialize).toHaveBeenCalledTimes(1);

    const scorm = new ScormInstance({ api: bridge.api });
    expect(scorm.init()).toBe(true);
    expect(scorm.version).toBe('2004');
    expect(scorm.get('cmi.learner_name')).toBe('Ada');
    expect(values['cmi.completion_status']).toBe('incomplete');

    expect(scorm.store({ page: 2 })).toBe(true);
    expect(values['cmi.suspend_data']).toBe('{"page":2}');
    expect(scorm.storage).toEqual({ page: 2 });

    await expect(bridge.getValueAsync('cmi.suspend_data')).resolves.toBe('{"page":2}');
    await expect(bridge.flush()).resolves.toBe(true);

    expect(scorm.terminate()).toBe(true);
    expect(values['cmi.exit']).toBe('suspend');
    expect(api.Terminate).toHaveBeenCalledTimes(1);
    expect(host.isActive).toBe(false);

    // Every reply after the handshake is addressed to the course origin only.
    expect(posted.filter(({ data }) => (data as { type: string }).type !== 'connect').length).toBeGreaterThan(0);
    for (const { data, targetOrigin } of posted) {
      if ((data as { type: string }).type === 'connect') expect(targetOrigin).toBe('*');
      else if (['ready', 'result'].includes((data as { type: string }).type)) expect(targetOrigin).toBe(COURSE_ORIGIN);
      else expect(targetOrigin).toBe(LMS_ORIGIN);
    }

    bridge.disconnect();
  });

  it('ignores hosts from origins that are not allowed', async () => {
    window.API_1484_11 = createScorm2004Api().api;
    const { iframe, child } = setupFrames();
    host = createScormHost({ iframe });

    await expect(
      connectToScormHost({ allowedOrigins: ['https://other.test'], target: child, timeout: 50 }),
    ).rejects.toThrow('Timed out');
  });

  it('ignores courses from origins that are not allowed', async () => {
    const { api } = createScorm2004Api();
    window.API_1484_11 = api;
    const { iframe, child } = setupFrames();
    host = createScormHost({ iframe, allowedOrigins: ['https://other.test'] });

    await expect(connectToScormHost({ allowedOrigins: [LMS_ORIGIN], target: child, timeout: 50 })).rejects.toThrow(
      'Timed out',
    );
    expect(api.Initialize).not.toHaveBeenCalled();
  });

  it('rejects the connection when the LMS API is missing', async () => {
    const { iframe, child } = setupFrames();
    host = createScormHost({ iframe });

    await expect(connectToScormHost({ allowedOrigins: [LMS_ORIGIN], target: child })).rejects.toThrow(
      'SCORM API not found.',
    );
  });

  it('reports host-side failures through the error event', async () => {
    const values: Record<string, string> = { 'cmi.core.lesson_status': 'incomplete' };
    let lastError = '0';
    const api: IScorm1_2 = {
      LMSInitialize: jest.fn(() => 'true'),
      LMSFinish: jest.fn(() => 'true'),
      LMSGetValue: jest.fn((element) => values[element] ?? ''),
      LMSSetValue: jest.fn(() => {
        lastError = '405';
        return 'false';
      }),
      LMSCommit: jest.fn(() => 'true'),
      LMSGetLastError: jest.fn(() => lastError),
      LMSGetErrorString: jest.fn(() => 'Incorrect Data Type'),
      LMSGetDiagnostic: jest.fn(() => ''),
    };
    window.API = api;
    const { iframe, child } = setupFrames();
    host = createScormHost({ iframe });

    const bridge = await connectToScormHost({ allowedOrigins: (origin) => origin === LMS_ORIGIN, target: child });
    const onError = jest.fn();
    bridge.addEventListener('error', onError);

    const scorm = new ScormInstance({ version: '1.2', api: bridge.api, autoCommit: false });
    expect(scorm.init()).toBe(true);
    expect(scorm.set('cmi.core.score.raw', 'abc')).toBe(true);
    await expect(bridge.flush()).resolves.toBe(false);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].detail).toMatchObject({
      type: 'set',
      element: 'cmi.core.score.raw',
      errorCode: '405',
      errorString: 'Incorrect Data Type',
    });
    bridge.disconnect();
  });

  it('terminates the session itself when the wrapper unloads', async () => {
    const { api, values } = createScorm2004Api();
    window.API_1484_11 = api;
    const { iframe, child } = setupFrames();
    host = createScormHost({ iframe });

    const bridge = await connectToScormHost({ allowedOrigins: [LMS_ORIGIN], target: child });
    window.dispatchEvent(new Event('pagehide'));

    expect(values['cmi.exit']).toBe('suspend');
    expect(api.Commit).toHaveBeenCalled();
    expect(api.Terminate).toHaveBeenCalledTimes(1);
    bridge.disconnect();
  });

  it('rejects wildcard origins', async () => {
    await expect(connectToScormHost({ allowedOrigins: ['*'] })).rejects.toThrow('"*"');
    expect(() => createScormHost({ iframe: document.createElement('iframe'), allowedOrigins: ['*'] })).toThrow('"*"');
  });
});
