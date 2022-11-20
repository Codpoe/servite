import { useEffect } from 'react';
import nprogress from 'nprogress';

export function useNProgress(isPending: boolean, wait = 0) {
  useEffect(() => {
    if (isPending) {
      const timer = setTimeout(() => {
        nprogress.start();
      }, wait);

      return () => {
        clearTimeout(timer);
        nprogress.done();
      };
    }
  }, [isPending, wait]);
}
