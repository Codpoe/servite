import React, { useEffect, useRef } from 'react';
import { useHref, useLinkClickHandler, LinkProps, To } from 'react-router-dom';

// eslint-disable-next-line import-x/export
export * from 'react-router-dom';

// eslint-disable-next-line import-x/export
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    {
      to,
      onClick,
      replace = false,
      state,
      target,
      preventScrollReset,
      relative,
      unstable_viewTransition,
      ...rest
    },
    ref,
  ) {
    const elRef = useRef<HTMLAnchorElement | null>();
    const href = useHref(to, { relative });

    const handleClick = useLinkClickHandler(to, {
      target,
      replace,
      state,
      preventScrollReset,
      relative,
      unstable_viewTransition,
    });

    useEffect(() => {
      if (!elRef.current || window.matchMedia('(min-width: 640px)').matches) {
        return;
      }

      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          observer.disconnect();
          (window.requestIdleCallback || ((cb: any) => setTimeout(cb, 100)))(
            () => {
              prefetchRouteAssets(to);
            },
          );
        }
      });

      observer.observe(elRef.current);

      return () => {
        observer.disconnect();
      };
    }, [to]);

    return (
      <a
        {...rest}
        ref={instance => {
          elRef.current = instance;

          if (typeof ref === 'function') {
            ref(instance);
          } else if (ref) {
            ref.current = instance;
          }
        }}
        href={href}
        target={target}
        onMouseEnter={() => prefetchRouteAssets(to)}
        onClick={event => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            handleClick(event);
          }
        }}
      />
    );
  },
);

export function prefetchRouteAssets(to: To) {
  return window.__servite_init_route_handles__?.(to);
}
