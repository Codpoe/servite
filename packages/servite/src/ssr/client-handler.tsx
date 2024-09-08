/// <reference types="vinxi/types/client" />
import 'vinxi/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { routes } from './routes.js';

declare global {
  interface Window {
    __servite?: {
      ssr: boolean;
    };
  }

  interface ImportMetaEnv {
    SSR_BASE_URL: string;
  }
}

const router = createBrowserRouter(routes, {
  basename: import.meta.env.SSR_BASE_URL,
});

const app = (
  <HelmetProvider>
    <RouterProvider router={router} />
  </HelmetProvider>
);

const rootEl = document.getElementById('root')!;

if (window.__servite?.ssr) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
