# usescorm

> React hook for communicating with the SCORM API.

I would recommend reading the the [SCORM documentation](https://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/) to familiarise yourself with the syntax.

## Install

```bash
npm install --save @blocdigital/usescorm
```

## Usage

```tsx
import { useState, useEffect } from 'react';

import useScorm from '@blocdigital/usescorm';

const Example = () => {
  // initiate the scorm session
  const scorm = useScorm({ version: '1.2' });

  const [state, setState] = useState(scorm?.storage || null);

  /**
   * toggle the pass status of a module
   *
   * @param {string} module which module to update
   * @param {number} item index of item
   */
  const handleToggle = (module, item) => {
    scorm.store((state) => {
      const newObj = structuredClone(state);

      newObj[module][item] = newObj[module][item] > 0 ? -1 : 1;

      return newObj;
    });
  };

  // set up listeners to keep state in sync with suspend data
  useEffect(() => {
    const onStateChange = (data) => setState(data);

    scorm.on('storage', onStateChange);

    // remember to tidy up your event listeners
    return () => scorm.off('storage', onStateChange);
  }, [scorm]);

  // initialise the suspend data
  useEffect(() => {
    scorm.store((state) => ({ module1: [0, 0, 0], module2: [0, 0, 0], ...state }));
  }, [scorm]);

  return (
    <>
      <h2>Module 1</h2>
      {state &&
        state.module1.map((pass, index) => (
          <p key={index}>
            Module 1, item {index + 1} is {pass === -1 ? 'failed' : pass === 1 ? 'passed' : 'not started'}
            <button onClick={() => handleToggle('module1', index)}>toggle</button>
          </p>
        ))}
      <h2>Module 2</h2>
      {state &&
        state.module2.map((pass, index) => (
          <p key={index}>
            Module 2, item {index + 1} is {pass === -1 ? 'failed' : pass === 1 ? 'passed' : 'not started'}
            <button onClick={() => handleToggle('module2', index)}>toggle</button>
          </p>
        ))}
    </>
  );
};
```

## Properties

| Name                   | Type    | Default | Description                                                                           |
| ---------------------- | ------- | ------- | ------------------------------------------------------------------------------------- |
| version                | string  | 'auto'  | Version of scorm used.                                                                |
| debug                  | boolean | false   | Whether or not debug mode is enabled.                                                 |
| handleCompletionStatus | boolean | true    | Whether or not the wrapper should automatically handle the initial completion status. |
| handleExitMode         | boolean | true    | Whether or not the wrapper should automatically handle the exit mode.                 |
| autoCommit             | boolean | true    | Whether or not the each action automatically saves.                                   |

## API

| Name                    | Type                                                                             | Description                                                                           |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| version                 | string                                                                           | Version of scorm used                                                                 |
| handleCompletionStatus  | boolean                                                                          | Whether or not the wrapper should automatically handle the initial completion status. |
| handleExitMode          | boolean                                                                          | Whether or not the wrapper should automatically handle the exit mode.                 |
| autoCommit              | boolean                                                                          | Whether or not the each action automatically saves.                                   |
| storage                 | unknown                                                                          | Live version of data that is in suspend_data.                                         |
| API.handle              | null \| IScorm1_2 \| IScorm2004                                                  | Stored version of SCORM API.                                                          |
| API.isFound             | boolean                                                                          | Whether the SCORM API has been detected or not.                                       |
| API.find                | (win: Window) => null \| IScorm1_2 \| IScorm2004                                 | Find a copy of SCORM.                                                                 |
| API.get                 | () => null \| IScorm1_2 \| IScorm2004                                            | Find a copy of SCORM (using current window).                                          |
| API.getHandle           | () => null \| IScorm1_2 \| IScorm2004                                            | Find a copy of SCORM (using current window + update handle).                          |
| connection.isActive     | boolean                                                                          | Whether the connection to the SCORM API is active.                                    |
| data.completionStatus   | lesson_status                                                                    | Current Course completion status.                                                     |
| data.exitStatus         | boolean                                                                          | Course Exit status.                                                                   |
| debug.isActive          | boolean                                                                          | Whether or not debug mode is enabled.                                                 |
| debug.getCode           | () => number                                                                     | Returns the error code that resulted from the last API call.                          |
| debug.getInfo           | (error: number) => string \| undefined                                           | Returns a short string describing the specified error code.                           |
| debug.getDiagnosticInfo | (error: number) => string \| undefined                                           | Returns detailed information about the last error that occurred.                      |
| init                    | () => boolean                                                                    | Begins a communication session with the LMS.                                          |
| terminate               | () => boolean                                                                    | Ends a communication session with the LMS.                                            |
| get                     | (parameter: CMIElement) => string                                                | Retrieves a value from the LMS.                                                       |
| set                     | (parameter: CMIElement, value: string) => boolean                                | Saves a value to the LMS                                                              |
| store                   | (value: unknown \| ((value: unknown) => unknown)) => boolean                     | Store data in suspense data                                                           |
| save                    | () => boolean                                                                    | Saves a value to the LMS.                                                             |
| status                  | (action: 'get' \| 'set', status?: lesson_status) => boolean \| lesson_status     | Update the lesson status.                                                             |
| on                      | (event: 'init' \| 'set' \| 'storage', callback: (data: unknown) => void) => void | Add event listener for when this component is used.                                   |
| onAny                   | (callback: (data: unknown) => void) => void                                      | Add event listener, for all events, for when this component is used.                  |
| off                     | (event: 'init' \| 'set' \| 'storage', callback: (data: unknown) => void) => void | If you exactly match an `on` event you can remove it.                                 |
| offAny                  | (callback: (data: unknown) => void) => void                                      | If you exactly match an `onAny` function you can remove it.                           |
