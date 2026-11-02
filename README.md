# useScorm

A React hook and typed wrapper for the SCORM runtime API exposed by a learning
management system (LMS). It supports SCORM 1.2 and SCORM 2004, with automatic
version detection. The hook opens the LMS session after mount and terminates it
when the component unmounts.

This package connects course content to an LMS; it is not an LMS. It does not
create SCORM packages or implement LMS-side sequencing, navigation, or course
delivery.

## Install

```bash
npm install @blocdigital/usescorm
```

React and React DOM are peer dependencies, so your application supplies them.

## Use

```tsx
import { useEffect } from 'react';
import useScorm from '@blocdigital/usescorm';

export function Lesson() {
  const scorm = useScorm({ version: '2004', autoCommit: false });

  useEffect(() => {
    if (!scorm.connection.isActive) return;

    scorm.set('cmi.location', 'module-1');
    scorm.status('set', 'incomplete');
    scorm.save();
  }, [scorm]);

  return null;
}
```

For SCORM 1.2, use `version: '1.2'`; its lesson status is stored in
`cmi.core.lesson_status`. SCORM 2004 uses `cmi.completion_status`. You can omit
`version` or set it to `'auto'` to detect the LMS API.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `version` | `'auto'` | `'1.2'`, `'2004'`, or automatic detection. |
| `debug` | `false` | Log API discovery and runtime failures. |
| `handleCompletionStatus` | `true` | Change a new or unknown attempt to incomplete. |
| `handleExitMode` | `true` | Set an exit mode when the session terminates. |
| `autoCommit` | `true` | Commit successful updates automatically. Set to `false` to batch updates and call `save()`. |
| `api` | — | Use this SCORM API object instead of searching parent windows. Used with the [postMessage bridge](#remote-courses-postmessage-bridge). |

## Runtime methods

| Method | Description |
| --- | --- |
| `init()` / `terminate()` | Start or end the LMS communication session. |
| `get(element)` / `set(element, value)` | Read or write a SCORM data-model element. |
| `store(value)` | JSON-serialize data into `cmi.suspend_data`. Pass a value or an updater function. |
| `save()` | Commit pending changes to the LMS. |
| `status('get')` / `status('set', value)` | Read or update the version-appropriate completion status. |
| `addEventListener(event, callback, options)` | Subscribe to `init`, `set`, `storage`, or `any` events. |
| `removeEventListener(event, callback, options)` | Remove a listener explicitly when not using an abort signal. |

`storage` contains parsed suspend data, or `null` when no saved data exists.
Suspend data must be JSON-serializable. The SCORM limits are 4,096 characters
for SCORM 1.2 and 64,000 characters for SCORM 2004; oversized values may be
rejected or truncated by the LMS.

When no LMS API is present, the hook remains inactive and `init()` returns
`false`. The runtime API is supplied by the LMS as `window.API` (SCORM 1.2) or
`window.API_1484_11` (SCORM 2004).

### Events

Use `addEventListener` to subscribe and `removeEventListener` to remove a
subscription manually. Each callback receives a `CustomEvent`; its payload is
available in `event.detail`.

| Event | `event.detail` |
| --- | --- |
| `init` | `true` after successful LMS initialization. |
| `set` | `{ parameter, value }` for a successful data-model write. |
| `storage` | Parsed suspend data, or `null` if there is no saved value. |
| `any` | `{ event, data }` for each of the events above. |

Use an `AbortController` to clean up one or more subscriptions together. In
React, abort it in the effect cleanup:

```ts
useEffect(() => {
  const controller = new AbortController();

  scorm.addEventListener('any', ({ detail: { event, data } }) => console.log(event, data), {
    signal: controller.signal,
  });

  return () => controller.abort();
}, [scorm]);
```

Listeners follow native `EventTarget` behavior. Options such as `once`,
`capture`, and `signal` are supported, and the same callback is only registered
once per event and capture setting. The existing `on` / `off` methods remain
aliases for individual events; `onAny` / `offAny` remain aliases for `any`.
These aliases use the same `CustomEvent` callback syntax.

## Types

The package exports `ScormInstance`, `ScormContext`, `IScorm1_2`, `IScorm2004`,
`IScormProps`, `IScormClass`, `CMIElement1_2`, and `CMIElement2004`, along with
the status and API types. For a version-specific hook, pass a literal version
such as `useScorm({ version: '2004' })`.

The bridge is exported separately from `@blocdigital/usescorm/bridge`, so apps
that do not use it do not bundle it.

## Remote courses (postMessage bridge)

A SCORM package normally contains the whole course. If you would rather host
the course on your own server (to deploy updates without re-uploading to every
LMS, or to share one build between many LMSs), the uploaded package can be a
thin wrapper that loads your site in an iframe.

That iframe is on a different origin from the LMS, so the browser stops it from
reading `window.parent.API`. The bridge solves this with `postMessage`:

```text
LMS window ─ window.API / API_1484_11
  └─ SCORM package (LMS origin)      createScormHost()     ← usescorm-host.js
       └─ <iframe> your course (your origin)  connectToScormHost() + useScorm({ api })
```

- The **host** runs inside the uploaded package. It finds the real LMS API,
  starts the session, and carries out requests from the iframe.
- The **client** runs in your course. It connects to the host and returns a
  `ScormBridge`. `bridge.api` behaves like `window.API` / `window.API_1484_11`,
  so `useScorm` and `ScormInstance` work as normal.

You therefore use the package in two places. Install it in your course from
npm, and copy the prebuilt host script into the SCORM package (no npm or build
step is needed in the LMS).

If your course is uploaded to the LMS itself, you do not need the bridge.

### 1. Set up the course (your remote app)

```bash
npm install @blocdigital/usescorm
```

Connect once, then render the course with the bridge's API. `allowedOrigins`
must list the origin(s) that **serve the SCORM package**. This is often the
LMS domain, but some LMSs serve package files from a separate content or CDN
domain. See [Finding the host origin](#finding-the-host-origin).

```tsx
import { useEffect, useState } from 'react';
import useScorm from '@blocdigital/usescorm';
import { connectToScormHost, type ScormBridge } from '@blocdigital/usescorm/bridge';

export function App() {
  const [bridge, setBridge] = useState<ScormBridge | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    let current: ScormBridge | undefined;

    connectToScormHost({ allowedOrigins: ['https://lms.example.com'] })
      .then((connected) => {
        if (!active) return connected.disconnect();
        current = connected;
        setBridge(connected);
      })
      .catch((reason: Error) => active && setError(reason));

    return () => {
      active = false;
      current?.disconnect();
    };
  }, []);

  if (error) return <p>Could not connect to the LMS: {error.message}</p>;
  if (!bridge) return <p>Connecting…</p>;

  return <Course bridge={bridge} />;
}

function Course({ bridge }: { bridge: ScormBridge }) {
  // Mount only once the bridge exists: useScorm reads `api` when it is first created.
  const scorm = useScorm({ api: bridge.api });

  useEffect(() => {
    const controller = new AbortController();

    bridge.addEventListener('error', ({ detail }) => console.error('LMS rejected', detail), {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [bridge]);

  // Use `scorm` exactly as you would without the bridge.
  return null;
}
```

Without React:

```ts
import { ScormInstance } from '@blocdigital/usescorm';
import { connectToScormHost } from '@blocdigital/usescorm/bridge';

const bridge = await connectToScormHost({ allowedOrigins: ['https://lms.example.com'] });
const scorm = new ScormInstance({ api: bridge.api });

scorm.init();
scorm.set('cmi.location', 'page-3');
```

To support both direct uploads and remote hosting from one build, call
`useScorm()` without `api` when `window.parent === window` or when the LMS API
can be reached directly. Use the bridge only when the course is framed by the
wrapper.

#### Server requirements for the course

- Allow the LMS to frame your site. Send
  `Content-Security-Policy: frame-ancestors https://lms.example.com`, and do not
  send `X-Frame-Options: DENY` / `SAMEORIGIN`.
- Serve the course over HTTPS. LMSs on HTTPS will block mixed content.
- Inside the iframe, your site is third-party content. Any cookies it relies on
  (such as a login) need `SameSite=None; Secure`, and some browsers (notably
  Safari) may still block them. Use the SCORM learner data rather than a
  separate login where possible.

### 2. Build the SCORM package (uploaded to the LMS)

The package needs three files:

```text
my-course.zip
├─ imsmanifest.xml
├─ index.html
└─ usescorm-host.js
```

**`usescorm-host.js`**: copy it from the installed package. It is a
self-contained script (about 4 kB gzipped) with no React dependency. It exposes
a `UseScormHost` global.

```bash
cp node_modules/@blocdigital/usescorm/dist/host/usescorm-host.js my-course/
```

Bundlers can also reach it as `@blocdigital/usescorm/host.js`.

**`index.html`**: a full-screen iframe pointing at your course, plus the host:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My course</title>
    <style>
      html, body, iframe { margin: 0; width: 100%; height: 100%; border: 0; display: block; }
    </style>
  </head>
  <body>
    <iframe id="course" title="My course" src="https://course.example.com/" allow="fullscreen; autoplay"></iframe>
    <script src="usescorm-host.js"></script>
    <script>
      UseScormHost.createScormHost({
        iframe: document.getElementById('course'),
        // version: '2004',  // match the manifest if you want to be strict
        // debug: true,
      });
    </script>
  </body>
</html>
```

By default, the host accepts messages only from the origin in the iframe's
`src` (`https://course.example.com` above). Pass `allowedOrigins` if the course
redirects to another origin.

**`imsmanifest.xml`**: a single-SCO manifest that lists both files. For SCORM 1.2:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="my-course" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org">
    <organization identifier="org">
      <title>My course</title>
      <item identifier="item" identifierref="resource">
        <title>My course</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="usescorm-host.js"/>
    </resource>
  </resources>
</manifest>
```

For SCORM 2004 4th Edition, change the namespaces and schema version, and use
`adlcp:scormType` (capital T):

```xml
<manifest identifier="my-course" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <!-- organizations as above -->
  <resources>
    <resource identifier="resource" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="usescorm-host.js"/>
    </resource>
  </resources>
</manifest>
```

Zip the **contents** of the folder, with `imsmanifest.xml` at the root of the
zip rather than inside a subfolder, and upload it. `npm run build:demo` in this
repository shows a complete scripted example of building these zips.

If you already bundle your own wrapper, you can import the host instead of
copying the script:

```ts
import { createScormHost } from '@blocdigital/usescorm/bridge';

createScormHost({ iframe: document.querySelector('iframe')! });
```

### Finding the host origin

The client's `allowedOrigins` must match the origin of the page running
`usescorm-host.js`, not necessarily the LMS address in the browser bar. To find
it, launch the package once and run `location.origin` in the devtools console
with the wrapper frame selected.
If one course serves many LMSs, list each origin or pass a predicate:

```ts
connectToScormHost({
  allowedOrigins: (origin) => origin === 'https://lms.example.com' || origin.endsWith('.lms-cdn.example.com'),
});
```

`endsWith` checks must include the leading dot, so that
`evil-lms-cdn.example.com` does not match.

### Bridge API

#### `createScormHost(options)` (in the SCORM package)

| Option | Default | Description |
| --- | --- | --- |
| `iframe` | required | The iframe that loads the course. |
| `allowedOrigins` | origin of `iframe.src` | Origins the course may send messages from. `'*'` is rejected. |
| `version` | `'auto'` | `'1.2'`, `'2004'`, or automatic detection. |
| `debug` | `false` | Log bridge traffic and API discovery. |
| `terminateOnUnload` | `true` | Commit and terminate the session if the wrapper unloads before the course has terminated. |
| `handleExitMode` | `true` | When terminating on unload, set `suspend` (incomplete) or `logout` / `normal` (complete) unless the course already set an exit mode. |

It returns `{ version, isActive, terminate(), destroy() }`. `destroy()` removes
the listeners without ending the session.

#### `connectToScormHost(options)` (in the course)

| Option | Default | Description |
| --- | --- | --- |
| `allowedOrigins` | required | Host origins to trust, or a predicate `(origin) => boolean`. `'*'` is rejected. |
| `target` | `window.parent` | Window running the host. |
| `timeout` | `10000` | Milliseconds to wait for the handshake, and for each acknowledgement. |
| `retryInterval` | `250` | Milliseconds between handshake attempts while the host loads. |
| `preload` | `[]` | Extra data-model elements to read on connect, such as `cmi.interactions.0.result`. |

It resolves with a `ScormBridge`, or rejects with a `ScormBridgeConnectionError`
when it times out, the LMS API is missing, `Initialize` fails, or the session
has already ended.

#### `ScormBridge`

| Member | Description |
| --- | --- |
| `api` | SCORM 1.2 or 2004 API object to pass to `useScorm({ api })` / `new ScormInstance({ api })`. |
| `version` | `'1.2'` or `'2004'`, as detected by the host. |
| `origin` | The verified host origin. |
| `getValueAsync(element)` | Read any element straight from the LMS and refresh the cache. |
| `flush()` | Wait for every outstanding acknowledgement. Resolves `false` if a request failed since the last flush. |
| `addEventListener('error', cb)` | `event.detail` is `{ type, element?, value?, errorCode, errorString, diagnostic }` for each request the LMS rejected. |
| `disconnect()` | Stop listening. The session is left to the host. |

### How the bridge behaves

- **Reads are synchronous and cached.** On connect, the host reads learner
  details, status, location, score, suspend data, preferences, and collection
  counts into a snapshot, so `get()`, `storage`, and `status('get')` work
  synchronously. Reading an element outside the snapshot returns `''` with
  error `101`. Use `preload` or `getValueAsync()` for those elements.
- **Writes are optimistic.** `set()`, `store()`, `save()`, and `terminate()`
  update the cache, send the request, and return `true` immediately. If the
  LMS rejects a request, the bridge emits an `error` event. Await `flush()` when
  you need confirmation, for example before telling the learner that progress
  was saved.
- **Order is preserved.** Requests are processed in the order they are sent.
- **Collection counts follow writes.** Writing `cmi.interactions.3.id` raises
  the cached `cmi.interactions._count` to at least 4.
- **Unloading is handled by the host.** Messages sent while the course page
  unloads are unreliable, so the host commits and terminates the session
  itself when the LMS closes the package. Call `scorm.terminate()` from the
  course when the learner finishes. The host's unload handler is the safety net.
- **Reloading the course reconnects.** If the iframe reloads, the next
  `connectToScormHost` gets a fresh snapshot from the open session. After the
  session has been terminated, connecting fails; relaunch from the LMS.

### Security

- Both ends check `event.source` and `event.origin` on every message. The host
  replies only to the iframe's origin, and the client sends data only to the
  verified host origin.
- The only message sent to `'*'` is the client's initial `connect`. It
  contains no learner data, only the names of the elements to preload.
- The host forwards only `cmi.*` / `adl.*` data-model reads and writes, plus
  commit and terminate. It never exposes the LMS API object itself.
- Keep `allowedOrigins` as narrow as possible. Any page on an allowed host
  origin that frames your course can read the learner's SCORM data.

### Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `Timed out waiting for the SCORM host` | `allowedOrigins` on the client does not include the host origin; the iframe `src` origin differs from the course's final origin (redirect), so pass `allowedOrigins` on the host; or `usescorm-host.js` did not load (check the manifest file list). |
| `SCORM API not found.` | The package was opened outside the LMS, or `version` on the host does not match the LMS. |
| Course shows a blank frame | `X-Frame-Options` or `frame-ancestors` on your server blocks the LMS. |
| Progress missing on relaunch | The LMS rejected a write (listen for the bridge `error` event), or the course never set a bookmark or suspend data. |

Turn on `debug: true` on the host to log every message and LMS response in the
wrapper frame's console.

## Development

Run `npm run build` to create the ESM and CommonJS builds, their type
declarations, and the standalone host script in `dist/host/usescorm-host.js`.
Use `npm run lint` and `npm test` to check changes.

### SCORM test bench

Run `npm run dev` to open a standalone test app. It shows connection status,
LMS responses and errors, and wrapper events. Without an LMS it shows a
connection error; it does not install a fake SCORM API.

To try it in your LMS:

1. Run `npm run build:demo`.
2. Upload `demo-dist/scorm-1.2.zip` or `demo-dist/scorm-2004.zip`, matching
   your LMS's supported version. The latter uses SCORM 2004 4th Edition.
3. Launch the activity as a learner. Read learner data, write a bookmark,
   score, session time, completion/success status, and JSON suspend data.
4. Click **Commit changes**, then **End session**. Relaunch from the LMS and
   read back the bookmark, score, status, and stored JSON to check persistence.

Use a disposable test learner/course: these controls change real LMS records.
Writes are not automatically committed, except the wrapper's initial status
handling. Leaving the page also attempts to commit and terminate the session.
An ended session must be relaunched from the LMS, not reinitialized.

`npm run preview` previews the compiled app locally (without an LMS API).
The app and upload ZIPs live outside the library source/output and are excluded
from `npm run build` and the published npm package.

### Remote test bench (postMessage bridge)

The same test bench can run as a remotely hosted course behind a thin SCORM
wrapper, to check the bridge end to end. `npm run build:demo` also produces:

| Output | What it is |
| --- | --- |
| `demo-dist/remote-course/` | The test bench as a static site, using `connectToScormHost`. Host this folder anywhere over HTTPS. |
| `demo-dist/remote-wrapper/` | The wrapper's files before zipping: `index.html` (iframe + `createScormHost`) and `usescorm-host.js`. It has no manifest, so do not upload it directly. |
| `demo-dist/remote-scorm-1.2.zip` / `remote-scorm-2004.zip` | The uploadable wrapper: the files above plus `imsmanifest.xml`. Only built when a course URL is supplied. |

To try it:

1. Run `npm run build:demo` and deploy `demo-dist/remote-course/` to any static
   host (for example Netlify, GitHub Pages, S3, or your own server). It uses
   relative asset paths, so a sub-folder works too.
2. Build the wrapper with the deployed URL:

   ```bash
   npm run build:demo -- --course-url=https://course.example.com/usescorm/
   ```

   You can also set the `COURSE_URL` environment variable instead.
   Without a URL, the zips are skipped: a wrapper with no course to load is
   no use, and the LMS needs the zip with its `imsmanifest.xml`.
3. Upload `demo-dist/remote-scorm-1.2.zip` or `remote-scorm-2004.zip` and
   launch it as a learner. Run the same checks as the standalone test bench.
   Use **Confirm with LMS** to wait for the LMS to accept the writes. Rejected
   writes appear in the log as bridge errors.
4. Close the activity without clicking **End session**, then relaunch it. The
   wrapper should have committed and terminated the session for you, with the
   bookmark and suspend data intact.

The wrapper runs the host with `debug: true`. Select the wrapper frame in
devtools to see every message and LMS response.

Because the LMS origin isn't known when the demo is built, the wrapper passes
its own origin to the course as `?scormHost=…`, and the course shows a **Demo
trust mode** banner. Any site framing the course could fake that parameter, so
do not use this in production. To pin the course to real LMS origins instead,
build it with:

```bash
# PowerShell: $env:VITE_SCORM_HOST_ORIGINS='https://lms.example.com'; npm run build:demo
VITE_SCORM_HOST_ORIGINS=https://lms.example.com npm run build:demo
```

When this is set, the query parameter is ignored.
