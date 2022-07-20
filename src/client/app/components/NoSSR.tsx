import { useIsMounted } from '../hooks';

export interface NoSSRProps {
  children: React.ReactNode;
}

export const NoSSR: React.FC<NoSSRProps> = ({ children }) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};
