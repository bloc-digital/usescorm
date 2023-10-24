import { useMemo, createContext } from 'react';

import { ScormInstance } from './ScormInstance';

import type { IScormProps, IScormClass } from './ScormInstance';

export default function useScorm({ version, debug, handleCompletionStatus, handleExitMode, autoCommit }: IScormProps) {
  return useMemo<IScormClass>(() => {
    const _instance = new ScormInstance({ version, debug, handleCompletionStatus, handleExitMode, autoCommit });

    _instance.init();

    return _instance;
  }, [version, debug, handleCompletionStatus, handleExitMode, autoCommit]);
}

export const ScormContext = createContext<IScormClass | null>(null);
