import { useEffect, useState } from 'react';

export interface ClientOnlyProps {
  children: React.ReactNode;
}

let _isMounted = false;

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
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
