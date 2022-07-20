import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { App, waitForPageReady } from './main';
import { createAppState, ssrData } from './state';

const Router = __HASH_ROUTER__ ? HashRouter : BrowserRouter;
const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[pressify]', 'Cannot find an element with id "root"');
    }
    return;
  }

  const { appState, AppStateProvider } = createAppState();

  const element = (
    <Router basename={basename}>
      <HelmetProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </HelmetProvider>
    </Router>
  );

  if (!ssrData) {
    createRoot(container).render(element);
    return;
  }

  await waitForPageReady(appState, ssrData.pagePath);
  hydrateRoot(container, element);
}

bootstrap();
