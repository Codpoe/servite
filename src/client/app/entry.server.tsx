import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { withoutBase, withoutTrailingSlash } from 'ufo';
import { SSREntryRenderContext } from '../shared.js';
// import ssrPrepass from 'react-ssr-prepass';
import { createApp } from './main.js';

const basename = withoutTrailingSlash(import.meta.env.BASE_URL);

export async function render(context: SSREntryRenderContext) {
  const { pathname } = context.ssrContext;
  const pagePath = withoutBase(pathname, basename);
  const App = await createApp({ pagePath, context });

  const element = (
    <StaticRouter basename={basename} location={pathname}>
      <App />
    </StaticRouter>
  );

  return renderToString(element);
}

export { pages } from 'virtual:servite/pages';
