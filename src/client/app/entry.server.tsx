import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
// import ssrPrepass from 'react-ssr-prepass';
import { createApp, CreateAppConfig } from './main.js';

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

export async function render(
  pathname: string,
  context: CreateAppConfig['context']
) {
  const pagePath = basename ? pathname.substring(basename.length) : pathname;
  const App = await createApp({ pagePath, context });

  const element = (
    <StaticRouter basename={basename} location={pathname}>
      <App />
    </StaticRouter>
  );

  return renderToString(element);
}

export { pages } from 'virtual:servite/pages';
