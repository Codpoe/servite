import { useEffect, useRef, useState } from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { routes, Route } from 'virtual:servite/routes';
import { pages } from 'virtual:servite/pages';
import { appContext } from './context';
import { AppState, PageError } from './types';
import { Page } from './components/Page';

const isSSR = import.meta.env.SSR;
const isDev = import.meta.env.DEV;

async function waitForPageReady(
  appState: AppState,
  routePath: string
): Promise<AppState | undefined> {
  if (appState.pageData?.routePath === routePath) {
    return;
  }

  const newAppState = { ...appState };
  const matches = matchRoutes(appState.routes, routePath);

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
      // TODO: path params
      pageData: appState.pages.find(p => p.routePath === routePath),
      pageModule,
      pageError: null,
    });
  } catch (err) {
    if (err instanceof Error) {
      newAppState.pageError = err;
    }
  } finally {
    newAppState.pageLoading = false;

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

export interface CreateAppConfig {
  routePath?: string;
  helmetContext?: Record<string, unknown>;
}

export async function createApp({
  routePath,
  helmetContext,
}: CreateAppConfig = {}) {
  let initialAppState: AppState = {
    routes,
    pages,
    pageLoading: false,
    pageError: null,
  };

  if (routePath) {
    initialAppState =
      (await waitForPageReady(initialAppState, routePath)) || initialAppState;
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

        const newAppState = await waitForPageReady(
          appStateRef.current,
          pathname
        );

        if (newAppState) {
          setAppState(newAppState);
        }

        clearTimeout(timer);
      })();
    }, [pathname]);

    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log('[servite] appState', appState);
    }, [appState]);

    return (
      <HelmetProvider context={helmetContext}>
        <Helmet defaultTitle="Servite App"></Helmet>
        <appContext.Provider value={appState}>
          <Page />
        </appContext.Provider>
      </HelmetProvider>
    );
  };
}
