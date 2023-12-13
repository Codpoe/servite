import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'servite/client';
import { scrollPromise } from './useScrollPromise';

/**
 * scroll to top while page change
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const navigationTypeRef = useRef(navigationType);

  navigationTypeRef.current = navigationType;

  useEffect(() => {
    if (navigationTypeRef.current === 'PUSH' && !window.location.hash) {
      (async () => {
        await scrollPromise.wait();
        window.scrollTo({
          top: 0,
        });
      })();
    }
  }, [pathname]);
}
