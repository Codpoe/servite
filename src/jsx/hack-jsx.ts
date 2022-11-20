import type { Island } from '../shared/types.js';

export function hackJsx(jsxObj: Record<string, any>) {
  // `islands` are filled during rendering
  const islands: Island[] = [];

  function _hackJsx(jsx: any) {
    if (import.meta.env.SSR) {
      return function hackedJsx(
        type: any,
        props?: Record<string, any>,
        ...rest: any[]
      ) {
        if (props?.__island && props?.__islandComponent) {
          const {
            __island: islandType,
            __islandOpts: opts,
            __islandClient: client,
            __islandComponent: component,
          } = props;

          delete props.__island;
          delete props.__islandOpts;
          delete props.__islandClient;
          delete props.__islandComponent;

          islands.push({
            type: islandType,
            component,
          });

          const slots: Record<string, any> = {};

          // Wrap children by `servite-slot`
          // TODO: wrap other element props by slot？
          if ('children' in props) {
            slots.children = jsx('servite-slot', {
              name: 'children',
              children: props.children,
            });
            delete props.children;
          }

          // Wrap by `servite-island`
          return jsx('servite-island', {
            type: islandType,
            opts,
            client,
            index: islands.length - 1,
            props: JSON.stringify(props),
            style: { display: 'contents' },
            children: client
              ? null
              : jsx(type, { ...props, ...slots }, ...rest),
          });
        }

        return jsx(type, props, ...rest);
      };
    }

    return jsx;
  }

  return Object.keys(jsxObj).reduce<Record<string, any>>(
    (res, key) => {
      res[key] = _hackJsx(jsxObj[key]);
      return res;
    },
    { islands }
  );
}
