/// <reference types="vinxi/types/client" />
import 'vinxi/client';
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
  RouterProviderProps,
  To,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';
import { getRoutes, HANDLE_INIT_KEY } from './routes.js';

declare global {
  interface Window {
    __servite_react_root__?: Root;
    __servite_react_router__?: RouterProviderProps['router'];
    __servite_init_route_handles__?: (location: To) => Promise<void>;
    __vite_plugin_react_preamble_installed__?: boolean;
    __vite_plugin_react_preamble_installed_resolve__?: (
      installed: boolean,
    ) => void;
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

  window.__servite_init_route_handles__ = async location => {
    await Promise.all(
      matchRoutes(routes, location, import.meta.env.SERVER_BASE)?.map(m => {
        return m.route.handle?.[HANDLE_INIT_KEY]?.();
      }) || [],
    );
  };

  window.__servite_init_route_handles__(window.location);

  window.__servite_react_router__ = createBrowserRouter(routes, {
    basename: import.meta.env.SERVER_BASE,
  });

  window.__servite_react_router__.subscribe(state => {
    state.matches.forEach(m => m.route.handle?.[HANDLE_INIT_KEY]?.());
  });

  const app = (
    <HelmetProvider>
      <RouterProvider
        router={window.__servite_react_router__}
        future={{ v7_startTransition: true }}
      />
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
