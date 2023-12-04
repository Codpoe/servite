import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  matchRoutes,
} from 'react-router-dom';
import { routes } from './routes';
import { NProgress } from './components/NProgress';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('[servite] Cannot find an element with id "root"');
  }

  const serverRendered = container.dataset.serverRendered === 'true';

  if (serverRendered) {
    // Determine if any of the initial routes are lazy
    const lazyMatches = matchRoutes(routes, window.location)?.filter(
      m => m.route.lazy
    );

    // Load the lazy matches and update the routes before creating router
    // so we can hydrate the SSR-rendered content synchronously
    if (lazyMatches?.length) {
      await Promise.all(
        lazyMatches.map(async ({ route }) => {
          const m = await route.lazy!();
          Object.assign(route, {
            ...m,
            lazy: undefined,
          });
        })
      );
    }
  }

  const router = createBrowserRouter(routes);

  const element = (
    <RouterProvider router={router} fallbackElement={<NProgress />} />
  );

  if (serverRendered) {
    // ssr hydrate
    hydrateRoot(container, element);
    return;
  }

  // csr
  createRoot(container).render(element);
}

bootstrap();
