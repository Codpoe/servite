import { useEffect, useRef, useState } from 'react';
import { useLocation, matchRoutes, matchPath } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import nprogress from 'nprogress';
import { pages } from 'virtual:servite/pages';
import { routes } from 'virtual:servite/pages-routes';
import { $URL } from 'ufo';
import {
  LoaderBaseContext,
  LoaderContext,
  Route,
  SSRContext,
  SSREntryRenderContext,
} from '../shared.js';
import { appContext, loaderDataContext } from './context.js';
import { AppState, PageError } from './types.js';
import { Page } from './components/Page.js';

const isBrowser = typeof window !== 'undefined';
// Ssr will inject global variable: `__SSR_DATA__`
const ssrData = isBrowser ? window.__SSR_DATA__ : undefined;

function createLoaderContext(ssrContext?: SSRContext): LoaderContext {
  const url = isBrowser ? window.location.href : ssrContext!.url;
  const { pathname, search, hash, query } = new $URL(url);

  const baseContext: LoaderBaseContext = {
    url,
    pathname,
    search,
    hash,
    query,
    params: {},
  };

  if (isBrowser) {
    return {
      ...baseContext,
      isBrowser: true,
    };
  }

  return {
    ...baseContext,
    isBrowser: false,
    event: ssrContext!.event,
  };
}

/**
 * Load page
 * - fetch page module
 * - execute page loader
 */
async function waitForPageReady({
  appState,
  pagePath,
  initial,
  context,
}: {
  appState: AppState;
  pagePath: string;
  initial: boolean;
  context?: SSREntryRenderContext;
}): Promise<AppState> {
  if (appState.pagePath === pagePath) {
    return appState;
  }

  const newAppState = { ...appState };
  const matches = matchRoutes(appState.routes, pagePath);

  if (!matches?.length) {
    newAppState.pageError = new PageError('Page not found', {
      isNotFound: true,
    });
    return newAppState;
  }

  try {
    const loaderContext = createLoaderContext(context?.ssrContext);
    const shouldLoad = !initial || !ssrData?.loaderData;
    const loaderData: any[] = [];

    const pageModules = await Promise.all(
      matches.map(async (match, index) => {
        const route = match.route as Route;
        const mod = await route.component.preload?.();

        // Execute loader
        if (shouldLoad && typeof mod?.loader === 'function') {
          loaderData[index] = await mod.loader({
            ...loaderContext,
            params: match.params,
          });
        }

        // Mount loader data in context for useLoaderData
        route.element = (
          <loaderDataContext.Provider value={loaderData[index]}>
            {route.element}
          </loaderDataContext.Provider>
        );

        return mod;
      })
    );

    const pageModule = pageModules.reduce(
      (res, mod) => ({ ...res, ...mod }),
      {}
    );

    // Mount loaderData in context for ssr.
    // The loaderData will be inject by __SSR_DATA__ in ssr,
    // and the client side can use the loaderData to render.
    if (context) {
      context.loaderData = loaderData;
    }

    Object.assign<AppState, Partial<AppState>>(newAppState, {
      pagePath,
      pageData: appState.pages.find(p => matchPath(p.routePath, pagePath)),
      pageModule,
      pageError: null,
      loaderData,
    });
  } catch (err) {
    if (err instanceof Error) {
      newAppState.pageError = err;
      // eslint-disable-next-line no-console
      console.error('[servite]', err);
    }
  } finally {
    newAppState.pageLoading = false;

    // In dev ssr, we should wait for style ready to show the page content
    if (
      typeof document !== 'undefined' &&
      document.documentElement.hasAttribute('hidden')
    ) {
      setTimeout(() => {
        document.documentElement.removeAttribute('hidden');
      }, 0);
    }
  }

  return newAppState;
}

export async function createApp({
  pagePath,
  context,
}: {
  pagePath: string;
  context?: SSREntryRenderContext;
}) {
  const initialAppState = await waitForPageReady({
    appState: {
      routes,
      pages,
      pageLoading: false,
      pageError: null,
    },
    pagePath,
    initial: true,
    context,
  });

  // Set loaderData in context for ssr.
  // The loaderData will be inject by __SSR_DATA__ in ssr,
  // and the client side can use the loaderData to render.
  if (context) {
    context.loaderData = initialAppState?.loaderData;
  }

  return function App() {
    const [appState, setAppState] = useState(initialAppState);
    const appStateRef = useRef(appState);
    appStateRef.current = appState;

    const { pathname } = useLocation();

    useEffect(() => {
      (async () => {
        const timer = setTimeout(() => {
          setAppState(prev => ({
            ...prev,
            pageLoading: true,
          }));
        }, 100);

        const newAppState = await waitForPageReady({
          appState: appStateRef.current,
          pagePath: pathname,
          initial: false,
        });

        setAppState(newAppState);
        clearTimeout(timer);
      })();
    }, [pathname]);

    useEffect(() => {
      if (appState.pageLoading) {
        nprogress.start();

        return () => {
          nprogress.done();
        };
      }
    }, [appState.pageLoading]);

    useEffect(() => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[servite] appState', appState);
      }
    }, [appState]);

    return (
      <HelmetProvider context={context?.helmetContext}>
        <Helmet defaultTitle="Servite App"></Helmet>
        <appContext.Provider value={appState}>
          <Page />
        </appContext.Provider>
      </HelmetProvider>
    );
  };
}
