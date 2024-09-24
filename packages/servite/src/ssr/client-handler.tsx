/// <reference types="vinxi/types/client" />
import 'vinxi/client';
import {
  createBrowserRouter,
  RouterProvider,
  RouterProviderProps,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { getRoutes } from './routes.js';

declare global {
  interface Window {
    __servite__?: {
      ssr: boolean;
    };
    __servite_react_root__?: Root;
    __servite_react_router__?: RouterProviderProps['router'];
    __vite_plugin_react_preamble_installed__?: boolean;
    __vite_plugin_react_preamble_installed_resolve__?: (
      installed: boolean,
    ) => void;
  }

  interface ImportMetaEnv {
    ROUTER_SSR_BASE_URL: string;
    CSR: boolean | string[];
    FALLBACK_TO_CSR: boolean;
  }
}

(async () => {
  if (import.meta.env.DEV && !window.__vite_plugin_react_preamble_installed__) {
    await new Promise<boolean>(resolve => {
      window.__vite_plugin_react_preamble_installed_resolve__ = resolve;
    });
  }

  const rootEl = document.getElementById('root')!;
  const routes = getRoutes();
  // eslint-disable-next-line no-console
  console.debug('[servite] routes', routes[0].children);

  window.__servite_react_router__ = createBrowserRouter(routes, {
    basename: import.meta.env.ROUTER_SSR_BASE_URL,
  });

  const app = (
    <HelmetProvider>
      <RouterProvider router={window.__servite_react_router__} />
    </HelmetProvider>
  );

  if (window.__servite__?.ssr) {
    window.__servite_react_root__ = hydrateRoot(rootEl, app);
    // eslint-disable-next-line no-console
    console.debug('[servite] hydrate successfully', window.__servite__);
  } else {
    (window.__servite_react_root__ = createRoot(rootEl)).render(app);
    // eslint-disable-next-line no-console
    console.debug('[servite] render successfully', window.__servite__ || {});
  }
})();
