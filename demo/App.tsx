import { useCallback, useEffect, useRef, useState } from 'react';

import useScorm from '../src/index.js';

type LogEntry = {
  id: number;
  time: string;
  level: 'success' | 'error' | 'event';
  label: string;
  detail: string;
};

const initialValues = {
  location: 'demo-page-1',
  scoreRaw: '75',
  scoreMin: '0',
  scoreMax: '100',
  sessionTime: 'PT1M',
  progress: '0.5',
};

export default function App() {
  const scorm = useScorm({ debug: true, autoCommit: false });
  const [active, setActive] = useState(false);
  const [ended, setEnded] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [suspendData, setSuspendData] = useState('{\n  "page": 1,\n  "message": "Hello from useScorm"\n}');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const nextId = useRef(0);
  const version = scorm.version;

  const log = useCallback((level: LogEntry['level'], label: string, detail: string) => {
    const entry = { id: nextId.current++, time: new Date().toLocaleTimeString(), level, label, detail };
    setLogs((previous) => [entry, ...previous].slice(0, 200));
  }, []);

  const run = useCallback(
    (label: string, action: () => unknown) => {
      const wasActive = scorm.connection.isActive;

      try {
        const result = action();
        const code = scorm.debug.getCode();
        const failed = result === false || code !== 0;
        const detail = [
          `Result: ${JSON.stringify(result, null, 2) ?? String(result)}`,
          code === undefined ? 'No LMS API is available.' : `LMS error: ${code}`,
          code ? scorm.debug.getInfo(code) : '',
          code ? scorm.debug.getDiagnosticInfo(code) : '',
        ]
          .filter(Boolean)
          .join('\n');

        log(failed ? 'error' : 'success', label, detail);
        return !failed;
      } catch (error) {
        log('error', label, error instanceof Error ? error.message : String(error));
        return false;
      } finally {
        setActive(scorm.connection.isActive);
        if (wasActive && !scorm.connection.isActive) setEnded(true);
      }
    },
    [log, scorm],
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    scorm.addEventListener(
      'any',
      ({ detail: { event, data } }) => {
        log('event', `Event: ${event}`, JSON.stringify(data, null, 2) ?? String(data));
      },
      { signal },
    );
    run('Automatic initialization', () => scorm.connection.isActive);
    window.addEventListener(
      'pagehide',
      () => {
        if (scorm.connection.isActive && run('Commit before leaving', () => scorm.save())) {
          run('Terminate before leaving', () => scorm.terminate());
        }
      },
      { signal },
    );

    return () => controller.abort();
  }, [log, run, scorm]);

  useEffect(() => {
    setValues((previous) => ({
      ...previous,
      sessionTime: version === '1.2' ? '0000:01:00.00' : 'PT1M',
    }));
  }, [version]);

  const is12 = version === '1.2';
  const fields = is12
    ? ({
        learnerId: 'cmi.core.student_id',
        learnerName: 'cmi.core.student_name',
        entry: 'cmi.core.entry',
        mode: 'cmi.core.lesson_mode',
        location: 'cmi.core.lesson_location',
        scoreRaw: 'cmi.core.score.raw',
        scoreMin: 'cmi.core.score.min',
        scoreMax: 'cmi.core.score.max',
        sessionTime: 'cmi.core.session_time',
      } as const)
    : ({
        learnerId: 'cmi.learner_id',
        learnerName: 'cmi.learner_name',
        entry: 'cmi.entry',
        mode: 'cmi.mode',
        location: 'cmi.location',
        scoreRaw: 'cmi.score.raw',
        scoreMin: 'cmi.score.min',
        scoreMax: 'cmi.score.max',
        sessionTime: 'cmi.session_time',
      } as const);

  const editableFields = [
    { key: 'location', label: 'Bookmark / location', element: fields.location, readable: true },
    { key: 'scoreRaw', label: 'Score', element: fields.scoreRaw, readable: true },
    { key: 'scoreMin', label: 'Minimum score', element: fields.scoreMin, readable: true },
    { key: 'scoreMax', label: 'Maximum score', element: fields.scoreMax, readable: true },
    { key: 'sessionTime', label: 'Session time (write-only)', element: fields.sessionTime, readable: false },
    ...(!is12
      ? ([{ key: 'progress', label: 'Progress (0 to 1)', element: 'cmi.progress_measure', readable: true }] as const)
      : []),
  ] as const;

  const statuses = is12
    ? (['not attempted', 'incomplete', 'completed', 'passed', 'failed', 'browsed'] as const)
    : (['unknown', 'not attempted', 'incomplete', 'completed'] as const);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">useScorm / developer tools</p>
          <h1>SCORM test bench</h1>
          <p>Talk to your LMS, inspect the responses, and check that changes survive a relaunch.</p>
        </div>
        <span className={`badge ${active ? 'connected' : 'disconnected'}`} role="status">
          {active ? `Connected / SCORM ${scorm.version}` : ended ? 'Session ended' : 'Not connected'}
        </span>
      </header>

      {!active && (
        <aside className="notice" role={ended ? 'status' : 'alert'}>
          <strong>{ended ? 'This session has ended.' : 'No active LMS connection.'}</strong>
          <p>
            {ended
              ? 'Relaunch the activity from your LMS to start another session.'
              : scorm.API.isFound
                ? 'An LMS API was found, but initialization failed. Check the activity log for details.'
                : 'No SCORM API was found. Open this activity from an LMS; a normal browser tab does not provide an LMS API.'}
          </p>
          {!ended && <p>Run npm run build:demo, then upload the matching ZIP from demo-dist to your LMS.</p>}
        </aside>
      )}

      <section className="card session" aria-labelledby="session-title">
        <div>
          <h2 id="session-title">Session</h2>
          <p>
            API detected: {scorm.API.isFound ? `SCORM ${scorm.version}` : 'none'}. Changes are not automatically
            committed. Initialization may mark a new attempt incomplete.
          </p>
        </div>
        <div className="actions">
          <button disabled={active || ended} onClick={() => run('Initialize', () => scorm.init())}>
            Retry connection
          </button>
          <button disabled={!active} onClick={() => run('Commit', () => scorm.save())}>
            Commit changes
          </button>
          <button
            className="danger"
            disabled={!active}
            onClick={() => {
              if (run('Commit before terminating', () => scorm.save())) {
                run('Terminate', () => scorm.terminate());
              }
            }}
          >
            End session
          </button>
        </div>
      </section>

      <div className="grid">
        <section className="card" aria-labelledby="data-title">
          <h2 id="data-title">Learner &amp; data</h2>
          <p>Read your learner details, then try writing a bookmark or score. Responses appear in the log.</p>
          <button
            disabled={!active}
            onClick={() => {
              for (const element of [
                fields.learnerId,
                fields.learnerName,
                fields.entry,
                fields.mode,
                'cmi.launch_data',
              ] as const) {
                run(`Read ${element}`, () => scorm.get(element));
              }
            }}
          >
            Read learner &amp; launch data
          </button>
          <div className="fields">
            {editableFields.map(({ key, label, element, readable }) => (
              <div className="field" key={key}>
                <label htmlFor={key}>{label}</label>
                <code>{element}</code>
                <div className="input-row">
                  <input
                    id={key}
                    value={values[key]}
                    disabled={!active}
                    onChange={(event) => {
                      const value = event.target.value;
                      setValues((previous) => ({ ...previous, [key]: value }));
                    }}
                  />
                  {readable && (
                    <button
                      disabled={!active}
                      aria-label={`Read ${label}`}
                      onClick={() =>
                        run(`Read ${element}`, () => {
                          const value = scorm.get(element);
                          if (scorm.debug.getCode() === 0) {
                            setValues((previous) => ({ ...previous, [key]: value }));
                          }
                          return value;
                        })
                      }
                    >
                      Read
                    </button>
                  )}
                  <button
                    disabled={!active}
                    aria-label={`Write ${label}`}
                    onClick={() => run(`Write ${element}`, () => scorm.set(element, values[key]))}
                  >
                    Write
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="hint">
            Session time format: {is12 ? 'HHHH:MM:SS.ss (for example 0000:01:00.00)' : 'ISO 8601 (for example PT1M)'}.
            Write minimum and maximum scores before the raw score if your LMS requires them.
          </p>
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="status-title">
            <h2 id="status-title">{is12 ? 'Lesson status' : 'Completion status'}</h2>
            <p>These are real attempt changes. Completing or passing the activity can affect your LMS record.</p>
            <button disabled={!active} onClick={() => run('Read completion status', () => scorm.status('get'))}>
              Read completion status
            </button>
            <div className="actions statuses">
              {statuses.map((status) => (
                <button
                  key={status}
                  disabled={!active}
                  onClick={() => run(`Set status: ${status}`, () => scorm.status('set', status))}
                >
                  {status}
                </button>
              ))}
            </div>
            {!is12 && (
              <>
                <h3>Success status (SCORM 2004)</h3>
                <button
                  disabled={!active}
                  onClick={() => run('Read success status', () => scorm.get('cmi.success_status'))}
                >
                  Read success status
                </button>
                <div className="actions statuses">
                  {(['unknown', 'passed', 'failed'] as const).map((status) => (
                    <button
                      key={status}
                      disabled={!active}
                      onClick={() => run(`Set success: ${status}`, () => scorm.set('cmi.success_status', status))}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="card" aria-labelledby="storage-title">
            <h2 id="storage-title">Suspend data</h2>
            <p>Store JSON, commit, and relaunch from your LMS to check that it was restored.</p>
            <label htmlFor="suspend-data">JSON data</label>
            <textarea
              id="suspend-data"
              rows={7}
              value={suspendData}
              disabled={!active}
              spellCheck={false}
              onChange={(event) => setSuspendData(event.target.value)}
            />
            <div className="actions">
              <button
                disabled={!active}
                onClick={() =>
                  run('Read suspend data', () => {
                    const value = scorm.storage;
                    setSuspendData(JSON.stringify(value, null, 2));
                    return value;
                  })
                }
              >
                Read stored JSON
              </button>
              <button
                disabled={!active}
                onClick={() => run('Store suspend data', () => scorm.store(JSON.parse(suspendData)))}
              >
                Store JSON
              </button>
            </div>
            <p className="hint">store() returns false if the JSON is unchanged. Invalid JSON is reported below.</p>
          </section>
        </div>
      </div>

      <section className="card" aria-labelledby="log-title">
        <div className="section-heading">
          <div>
            <h2 id="log-title">Activity log</h2>
            <p>Latest first. Includes wrapper events, return values, and LMS diagnostics. Keeps 200 entries.</p>
          </div>
          <div className="actions">
            <button
              disabled={!scorm.API.isFound}
              onClick={() =>
                run('Last LMS error', () => {
                  const code = scorm.debug.getCode();
                  return {
                    code,
                    info: code === undefined ? undefined : scorm.debug.getInfo(code),
                    diagnostic: code === undefined ? undefined : scorm.debug.getDiagnosticInfo(code),
                  };
                })
              }
            >
              Read last LMS error
            </button>
            <button disabled={logs.length === 0} onClick={() => setLogs([])}>
              Clear log
            </button>
          </div>
        </div>
        <ol className="log" aria-label="Activity log" aria-live="polite">
          {logs.map((entry) => (
            <li className={entry.level} key={entry.id}>
              <div className="log-heading">
                <time>{entry.time}</time>
                <strong>{entry.label}</strong>
                <span>{entry.level}</span>
              </div>
              <pre>{entry.detail}</pre>
            </li>
          ))}
        </ol>
      </section>
      <footer>
        This test uses the real LMS API; it does not simulate one. Leaving the page attempts to commit and end the
        session. Use a disposable test learner or course.
      </footer>
    </main>
  );
}
