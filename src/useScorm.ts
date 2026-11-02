import { createContext, useEffect, useState } from 'react';

import { ScormInstance } from './ScormInstance.js';

import type { IScormProps, IScormClass, availableVersions } from './ScormInstance.js';

export default function useScorm<T extends availableVersions = 'auto'>({
  version,
  debug,
  handleCompletionStatus,
  handleExitMode,
  autoCommit,
  api,
}: IScormProps<T>) {
  const [instance] = useState(
    new ScormInstance({ version, debug, handleCompletionStatus, handleExitMode, autoCommit, api }),
  );

  useEffect(() => {
    instance.init();

    return () => void (instance.connection.isActive && instance.terminate());
  }, [instance]);

  return instance;
}

export const ScormContext = createContext<IScormClass<'auto'> | null>(null);
