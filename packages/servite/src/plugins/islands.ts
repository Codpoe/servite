import { fileURLToPath } from 'url';
import crypto from 'node:crypto';
import { Plugin } from 'vinxi';

const ISLAND_PATH = fileURLToPath(
  new URL('../runtime/island/Island.js', import.meta.url),
);

export function islands(): Plugin {
  return {
    name: 'servite-islands',
    enforce: 'pre',
    resolveId: {
      order: 'pre',
      async handler(source, importer, options) {
        if (source.startsWith('island:')) {
          const resolved = await this.resolve(source, importer, {
            ...options,
            skipSelf: true,
          });

          if (!resolved) {
            return;
          }

          const [pathname, query] = resolved.id.split('?');
          const sp = new URLSearchParams(query);
          sp.set('island', '');

          return {
            ...resolved,
            id: pathname + '?' + sp.toString(),
          };
        }
      },
    },
    load(id, options) {
      const [pathname, query] = id.split('?');
      const sp = new URLSearchParams(query);

      if (sp.has('island')) {
        sp.delete('island');
        const idWithoutIsland = (pathname + '?' + sp.toString()).replace(
          /\?$/,
          '',
        );
        const islandId =
          'island_' +
          crypto
            .createHash('sha256')
            .update(pathname)
            .digest()
            .toString('hex')
            .slice(0, 5);

        // ssr
        if (options?.ssr) {
          return `\
          import Component from '${idWithoutIsland}';
          
          export default function ServerIsland(props) {
            return (
              <servite-island id={props.hydrate?.id || '${islandId}'} style={{ display: 'contents' }}>
                <Component {...props} />
              </servite-island>
            );
          }
          `;
        }

        // browser
        return `\
        import { forwardRef } from 'react';
        import { Island } from '${ISLAND_PATH}';

        const load = () => import('${idWithoutIsland}');

        export default forwardRef(function ClientIsland(props, ref) {
          return (
            <Island
              {...props}
              innerRef={ref}
              hydrate={{
                ...props.hydrate,
                id: props.hydrate?.id || '${islandId}',
                load,
              }}
            />
          );
        });
        `;
      }
    },
  };
}
