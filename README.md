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

## Development

Run `npm run build` to create the ESM and CommonJS builds and their type
declarations. Use `npm run lint` and `npm test` to check changes.

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
