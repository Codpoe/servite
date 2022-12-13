import { useState, useEffect } from 'react';
import { useLocation } from 'servite/client';
import { IN_BROWSER } from '../constants';

function resolveHash() {
  return decodeURIComponent(IN_BROWSER ? window.location.hash : '').slice(1);
}

export function useHash() {
  const { pathname } = useLocation();
  const [hash, setHash] = useState(resolveHash());

  useEffect(() => {
    function handleHashChange() {
      setHash(resolveHash());
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // pathname 变化时不会触发 hashchange 方法，这会导致 hash 状态没正常清理的问题，
  // 所以这里监听 pathname，手动修改一下 hash
  useEffect(() => {
    setHash(resolveHash());
  }, [pathname]);

  return hash;
}
