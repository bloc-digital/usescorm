import { renderHook } from '@testing-library/react';

import useScorm from './useScorm';

describe('Hook should not be active if there is no SCORM', () => {
  it('There should be not error and connection should be false', () => {
    const { result } = renderHook(() => useScorm({}));

    expect(result.current.connection.isActive).toBe(false);
  });
});
