import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { createApp } from './main';

// `build` will inject global variable: `__SSR_DATA__`
const ssrData = typeof window !== 'undefined' ? window.__SSR_DATA__ : undefined;

const Router = __HASH_ROUTER__ ? HashRouter : BrowserRouter;
const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('[servite] Cannot find an element with id "root"');
  }

  const App = await createApp({ pagePath: ssrData?.pagePath });

  const element = (
    <Router basename={basename}>
      <App />
    </Router>
  );

  if (!ssrData) {
    // csr
    createRoot(container).render(element);
    return;
  }

  // ssr hydrate
  hydrateRoot(container, element);
}

bootstrap();
