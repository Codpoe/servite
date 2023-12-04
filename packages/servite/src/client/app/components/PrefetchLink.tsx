import React from 'react';
import { Link, matchRoutes, resolvePath, type To } from 'react-router-dom';
import { useLocation } from '../router';
import { hasIslands } from '../constants.js';
import { useApp } from '../context';

export interface PrefetchLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: To;
}

/**
 * Based on the Link component of react-router-dom
 *
 * features:
 * - prefetch page assets while mouse enter
 */
export const PrefetchLink = React.forwardRef<
  HTMLAnchorElement,
  PrefetchLinkProps
>(function LinkWithRef({ to, ...rest }, ref) {
  const { pathname } = useLocation();
  const { routes } = useApp();

  const handleMouseEnter = () => {
    if (
      !hasIslands &&
      ((typeof to === 'string' && to.startsWith('/')) ||
        (typeof to === 'object' && to.pathname?.startsWith('/')))
    ) {
      const { pathname: targetPath } = resolvePath(to, pathname);

      if (targetPath !== pathname) {
        matchRoutes(routes || [], targetPath)?.forEach(m => {
          m.route.lazy?.();
          // TODO: execute loader?
        });
      }
    }
  };

  return <Link {...rest} to={to} ref={ref} onMouseEnter={handleMouseEnter} />;
});
