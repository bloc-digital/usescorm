# uselocalstorage

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
