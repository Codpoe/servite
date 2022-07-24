import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { createApp } from './main';

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

export async function render(
  pathname: string,
  helmetContext: Record<string, unknown>
) {
  const pagePath = basename ? pathname.substring(basename.length) : pathname;
  const App = await createApp({ pagePath, helmetContext });

  return renderToString(
    <StaticRouter basename={basename} location={pathname}>
      <App />
    </StaticRouter>
  );
}

export { default as entries } from 'virtual:conventional-entries';
export { default as pagesData } from 'virtual:conventional-pages-data';
