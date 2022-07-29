import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { createApp, CreateAppConfig } from './main';

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

export async function render(
  pathname: string,
  context: CreateAppConfig['context']
) {
  const pagePath = basename ? pathname.substring(basename.length) : pathname;
  const App = await createApp({ pagePath, context });

  return renderToString(
    <StaticRouter basename={basename} location={pathname}>
      <App />
    </StaticRouter>
  );
}

export { pages } from 'virtual:servite/pages';
