import { useMemo } from 'react';
import { useLocation } from 'servite/client';

export function matchActive(
  {
    link,
    activeMatch,
  }: {
    link?: string;
    activeMatch?: string;
  },
  pathname: string
) {
  if (!link) {
    return false;
  }

  if (activeMatch) {
    return new RegExp(activeMatch).test(pathname);
  }

  const remainPath = pathname.substring(link.length);

  return (
    pathname.startsWith(link) && (!remainPath || remainPath.startsWith('/'))
  );
}

export function useActiveMatch({
  link,
  activeMatch,
}: {
  link?: string;
  activeMatch?: string;
}) {
  const { pathname } = useLocation();

  return useMemo(
    () => matchActive({ link, activeMatch }, pathname),
    [link, activeMatch, pathname]
  );
}
