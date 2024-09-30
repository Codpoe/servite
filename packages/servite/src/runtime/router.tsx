import React, { startTransition } from 'react';
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
    const href = useHref(to, { relative });

    const handleClick = useLinkClickHandler(to, {
      target,
      replace,
      state,
      preventScrollReset,
      relative,
      unstable_viewTransition,
    });

    return (
      <a
        {...rest}
        ref={ref}
        href={href}
        target={target}
        onMouseEnter={() => prefetchRouteAssets(to)}
        onClick={event => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            startTransition(() => {
              handleClick(event);
            });
          }
        }}
      />
    );
  },
);

export function prefetchRouteAssets(to: To) {
  return window.__servite_init_route_handles__?.(to);
}
