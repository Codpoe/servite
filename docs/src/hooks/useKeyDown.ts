import { useEffect, DependencyList } from 'react';

export function useKeyDown(
  callback: (ev: KeyboardEvent) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    window.addEventListener('keydown', callback);

    return () => {
      window.removeEventListener('keydown', callback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
