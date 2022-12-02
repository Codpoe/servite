import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createApp } from './main.js';

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
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
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
