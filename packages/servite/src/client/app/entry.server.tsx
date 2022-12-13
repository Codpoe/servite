import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { withoutBase, withoutTrailingSlash } from 'ufo';
import customRender from 'virtual:servite/custom-server-render';
import { islands } from 'virtual:servite-dist/jsx/jsx-runtime';
import { islands as devIslands } from 'virtual:servite-dist/jsx/jsx-dev-runtime';
import type {
  SSREntryRenderContext,
  SSREntryRenderResult,
} from '../../shared/types.js';
// import ssrPrepass from 'react-ssr-prepass';
import { createApp } from './main.js';

const basename = withoutTrailingSlash(import.meta.env.BASE_URL);

export async function render(
  context: SSREntryRenderContext
): Promise<SSREntryRenderResult> {
  // We need to reset the array before rendering
  // to avoid confusion of the array from the previous render
  islands.length = 0;
  devIslands.length = 0;

  const { pathname } = context.ssrContext;
  const pagePath = withoutBase(pathname, basename);
  const App = await createApp({ pagePath, context });

  const element = (
    <StaticRouter basename={basename} location={pathname}>
      <App />
    </StaticRouter>
  );

  const { appHtml, headTags } = await (customRender || fallbackRender)(element);

  // `islandComponents` are filled during rendering.
  // add islandComponents in context
  // so that server/runtime/renderer can render the island components script
  context.islands = islands.concat(devIslands);

  return { appHtml, headTags };
}

export { pages } from 'virtual:servite/pages';
export { routes } from 'virtual:servite/pages-routes';

function fallbackRender(element: ReactElement): SSREntryRenderResult {
  return {
    appHtml: renderToString(element),
  };
}
