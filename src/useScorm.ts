import { useMemo, createContext } from 'react';

import { ScormInstance } from './ScormInstance';

import type { IScormProps, IScormClass, availableVersions } from './ScormInstance';

export default function useScorm<T extends availableVersions = 'auto'>({
  version,
  debug,
  handleCompletionStatus,
  handleExitMode,
  autoCommit,
}: IScormProps<T>) {
  return useMemo(() => {
    const _instance = new ScormInstance({ version, debug, handleCompletionStatus, handleExitMode, autoCommit });

    _instance.init();

    return _instance;
  }, [version, debug, handleCompletionStatus, handleExitMode, autoCommit]);
}

export const ScormContext = createContext<IScormClass<'auto'> | null>(null);
