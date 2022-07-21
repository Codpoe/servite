import { useEffect, useState } from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import routes, { Route } from 'virtual:conventional-routes';
import pagesData from 'virtual:conventional-pages-data';
import { appContext } from './context';
import { AppState, PageError } from './types';

async function waitForPageReady(
  appState: AppState,
  pagePath: string
): Promise<AppState | undefined> {
  if (appState.pagePath === pagePath) {
    return;
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
    const modules = await Promise.all(
      matches.map(async m => (m.route as Route).component.preload?.())
    );

    // TODO: run preload

    const pageModule = modules.reduce(
      (all, current) => ({
        ...all,
        ...current,
      }),
      {}
    );

    Object.assign(newAppState, {
      pagePath,
      pageData: appState.pagesData[pagePath],
      pageModule,
      pageError: null,
    });
  } catch (err) {
    if (err instanceof Error) {
      newAppState.pageError = err;
    }
  } finally {
    newAppState.pageLoading = false;
  }

  return newAppState;
}

export interface CreateAppConfig {
  pagePath?: string;
  helmetContext?: Record<string, unknown>;
}

export async function createApp({
  pagePath,
  helmetContext,
}: CreateAppConfig = {}) {
  let initialAppState: AppState = {
    routes,
    pagesData,
    pageLoading: false,
    pageError: null,
  };

  if (pagePath) {
    initialAppState =
      (await waitForPageReady(initialAppState, pagePath)) || initialAppState;
  }

  return function App() {
    const [appState, setAppState] = useState(initialAppState);
    const { pathname } = useLocation();

    useEffect(() => {
      (async () => {
        const timer = setTimeout(() => {
          appState.pageLoading = true;
        }, 100);

        const newAppState = await waitForPageReady(appState, pathname);

        if (newAppState) {
          setAppState(newAppState);
        }

        clearTimeout(timer);
      })();
    }, [pathname, appState]);

    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log('[servite] appState', appState);
    }, [appState]);

    return (
      <HelmetProvider context={helmetContext}>
        <appContext.Provider value={appState}>123</appContext.Provider>
      </HelmetProvider>
    );
  };
}
