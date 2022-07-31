import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { createApp } from './main.js';

const Router = __HASH_ROUTER__ ? HashRouter : BrowserRouter;
const basename = import.meta.env.BASE_URL?.replace(/\/$/, '');
const pathname = window.location.pathname;
const pagePath = basename ? pathname.substring(basename.length) : pathname;

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('[servite] Cannot find an element with id "root"');
  }

  const App = await createApp({ pagePath });

  const element = (
    <Router basename={basename}>
      <App />
    </Router>
  );

  if (container.dataset.serverRendered === 'true') {
    // ssr hydrate
    hydrateRoot(container, element);
    return;
  }

  // csr
  createRoot(container).render(element);
}

bootstrap();
