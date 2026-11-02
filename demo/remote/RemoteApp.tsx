import { useEffect, useState } from 'react';

import App from '../App.js';
import { connectToScormHost, type ScormBridge } from '../../src/bridge/index.js';

/** Origins locked in at build time with VITE_SCORM_HOST_ORIGINS (comma-separated). */
const configuredOrigins = String(import.meta.env.VITE_SCORM_HOST_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/** Demo only: the wrapper passes its own origin, which any site framing the course could fake. */
const getQueryOrigin = () => {
  const value = new URLSearchParams(window.location.search).get('scormHost');

  try {
    return value && new URL(value).origin === value ? value : null;
  } catch {
    return null;
  }
};

const queryOrigin = configuredOrigins.length ? null : getQueryOrigin();
const allowedOrigins = configuredOrigins.length ? configuredOrigins : queryOrigin ? [queryOrigin] : [];
const isFramed = window.parent !== window;

export default function RemoteApp() {
  const [bridge, setBridge] = useState<ScormBridge | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFramed || !allowedOrigins.length) return;

    let active = true;
    let current: ScormBridge | undefined;

    connectToScormHost({ allowedOrigins })
      .then((connected) => {
        if (!active) return connected.disconnect();
        current = connected;
        setBridge(connected);
      })
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : String(reason)));

    return () => {
      active = false;
      current?.disconnect();
    };
  }, []);

  if (bridge) {
    return (
      <>
        {queryOrigin && (
          <aside className="notice demo-warning" role="status">
            <strong>Demo trust mode.</strong> This course trusts <code>{queryOrigin}</code> because the wrapper said so
            in the URL. Build with <code>VITE_SCORM_HOST_ORIGINS</code> to lock it to known LMS origins.
          </aside>
        )}
        <App bridge={bridge} />
      </>
    );
  }

  const problem = !isFramed
    ? 'This page is not inside the SCORM wrapper. Upload a remote-scorm ZIP from demo-dist to your LMS and launch it from there.'
    : !allowedOrigins.length
      ? 'No host origin is configured. Build with VITE_SCORM_HOST_ORIGINS, or launch through the demo wrapper (which adds ?scormHost=…).'
      : error;

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">useScorm / remote course</p>
          <h1>SCORM remote test bench</h1>
          <p>This course is hosted outside the LMS and talks to it through the postMessage bridge.</p>
        </div>
        <span className="badge disconnected" role="status">
          {problem ? 'Not connected' : 'Connecting…'}
        </span>
      </header>
      <aside className="notice" role={problem ? 'alert' : 'status'}>
        <strong>{problem ? 'Could not connect to the SCORM wrapper.' : 'Waiting for the SCORM wrapper…'}</strong>
        <p>{problem ?? `Trusted host origins: ${allowedOrigins.join(', ')}`}</p>
        {error && (
          <p>
            Check that the wrapper loaded <code>usescorm-host.js</code>, that the course URL in the wrapper matches this
            page&apos;s origin, and that the trusted origins include the wrapper&apos;s origin.
          </p>
        )}
      </aside>
    </main>
  );
}
