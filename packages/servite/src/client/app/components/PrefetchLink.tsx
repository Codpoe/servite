import React from 'react';
import { matchRoutes, resolvePath, type To } from 'react-router-dom';
import { useHref, useLinkClickHandler, useLocation } from '../router.js';
import { hasIslands } from '../constants.js';
import { useApp } from '../context.js';

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
>(function LinkWithRef(
  { to, replace = false, state, target, reloadDocument, onClick, ...rest },
  ref
) {
  const href = useHref(to);
  const internalOnClick = useLinkClickHandler(to, { replace, state, target });
  const { pathname } = useLocation();
  const { router } = useApp();

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (onClick) {
      onClick(event);
    }

    if (!hasIslands && !event.defaultPrevented && !reloadDocument) {
      internalOnClick(event);
    }
  };

  const handleMouseEnter = () => {
    if (
      !hasIslands &&
      ((typeof to === 'string' && to.startsWith('/')) ||
        (typeof to === 'object' && to.pathname?.startsWith('/')))
    ) {
      const { pathname: targetPath } = resolvePath(to, pathname);

      if (targetPath !== pathname) {
        matchRoutes(router.routes || [], targetPath)?.forEach(m => {
          m.route.lazy?.();
          // TODO: execute loader?
        });
      }
    }
  };

  return (
    <a
      {...rest}
      ref={ref}
      href={href}
      target={target}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    />
  );
});
