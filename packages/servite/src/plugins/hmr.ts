import { App, Plugin } from 'vinxi';
import { RouterName } from '../types/index.js';

// @vitejs/plugin-react
const reactRefreshRuntimePath = '/@react-refresh';

export interface HmrConfig {
  app: App;
}

export function hmr({ app }: HmrConfig): Plugin {
  return {
    name: 'servite-client-hmr',
    apply: 'serve',
    enforce: 'post',
    // If export key starts with `$` or the module is a mdx file, we need to determine if this export has changed.
    transform(code, id) {
      if (
        id === reactRefreshRuntimePath &&
        code.includes('return prevExports[key] === nextExports[key]')
      ) {
        return code.replace(
          'return prevExports[key] === nextExports[key]',
          `if (/fileName:\\s*"[^"]+\\/(page|layout)\\.[jt]sx?/ && key === 'handle' || /fileName:\\s*"[^"]+\\.mdx?/.test(nextExports.default?.toString?.() || '') && ['frontmatter', 'toc'].includes(key)) {
            return JSON.stringify(prevExports[key]) === JSON.stringify(nextExports[key]);
          }
            return prevExports[key] === nextExports[key];`,
        );
      }
    },
    // Page file will generate multiple different modules. e.g.
    //
    // file: src/pages/home/page.tsx
    // ↓↓↓
    // modules:
    //   - src/pages/home/page.tsx
    //   - src/pages/home/page.tsx?pick=default
    //   - src/pages/home/page.tsx?pick=ErrorBoundary
    //
    // And vinxi will only include the `pick` module for hmr.
    // But we still need to include the original module for tailwindcss hmr.
    handleHotUpdate(ctx) {
      if (
        app.getRouter(RouterName.Client).internals.routes?.isRoute(ctx.file)
      ) {
        let added = false;
        return ctx.modules.flatMap(mod => {
          if (
            !added &&
            mod.file === ctx.file &&
            new URLSearchParams(mod.id?.split('?')[1]).has('pick')
          ) {
            const originMod = ctx.server.moduleGraph.getModuleById(ctx.file);

            if (originMod) {
              added = true;
              return [mod, originMod];
            }
          }
          return mod;
        });
      }
    },
  };
}
