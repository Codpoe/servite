import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import path from 'upath';
import { App, waitForPageReady } from './main';
import { createAppState } from './state';

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

export async function render(
  pagePath: string,
  helmetContext: Record<string, unknown>
) {
  const { appState, AppStateProvider } = createAppState();
  await waitForPageReady(appState, pagePath);

  return renderToString(
    <StaticRouter
      basename={basename}
      location={path.join(basename || '', pagePath)}
    >
      <HelmetProvider context={helmetContext}>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </HelmetProvider>
    </StaticRouter>
  );
}

export { default as pagesData } from 'virtual:conventional-pages-data';
