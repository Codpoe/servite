import { useEffect, useState } from 'react';

export interface NoSSRProps {
  children: React.ReactNode;
}

let _isMounted = false;

export const NoSSR: React.FC<NoSSRProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(_isMounted);

  useEffect(() => {
    _isMounted = true;
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};
