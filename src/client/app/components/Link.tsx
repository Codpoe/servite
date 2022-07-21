import React, { useEffect, useTransition } from 'react';
import {
  matchRoutes,
  resolvePath,
  To,
  useHref,
  useLinkClickHandler,
  useLocation,
} from 'react-router-dom';
import nprogress from 'nprogress';
import { useAppState } from '../context';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: To;
}

/**
 * Based on the Link component of react-router-dom
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref
  ) {
    const href = useHref(to);
    const internalOnClick = useLinkClickHandler(to, { replace, state, target });
    const [isPending, startTransition] = useTransition();
    const { pathname } = useLocation();
    const { routes } = useAppState();

    const handleClick = (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      if (onClick) {
        onClick(event);
      }

      if (!event.defaultPrevented && !reloadDocument) {
        startTransition(() => {
          internalOnClick(event);
        });
      }
    };

    const handleMouseEnter = () => {
      if (
        (typeof to === 'string' && to.startsWith('/')) ||
        (typeof to === 'object' && to.pathname?.startsWith('/'))
      ) {
        const { pathname: targetPath } = resolvePath(to, pathname);

        if (targetPath !== pathname) {
          matchRoutes(routes || [], targetPath)?.forEach(m => {
            (m.route as any).component?.prefetch?.();
          });
        }
      }
    };

    useEffect(() => {
      if (isPending) {
        const timer = setTimeout(() => {
          nprogress.start();
        }, 200);

        return () => {
          clearTimeout(timer);
          nprogress.done();
        };
      }
    }, [isPending]);

    return (
      <a
        {...rest}
        href={href}
        onClick={handleClick}
        ref={ref}
        target={target}
        onMouseEnter={handleMouseEnter}
      />
    );
  }
);
