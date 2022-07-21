import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import path from 'upath';
import { createApp } from './main';

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

export async function render(
  pagePath: string,
  helmetContext: Record<string, unknown>
) {
  const App = await createApp({ pagePath, helmetContext });

  return renderToString(
    <StaticRouter
      basename={basename}
      location={path.join(basename || '', pagePath)}
    >
      <App />
    </StaticRouter>
  );
}

export { default as pagesData } from 'virtual:conventional-pages-data';
