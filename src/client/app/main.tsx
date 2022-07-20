import { useContext, useEffect, useLayoutEffect } from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';
import { ref } from 'valtio';
import { MDXProvider } from '@mdx-js/react';
import { Route } from 'virtual:conventional-routes';
import { appContext } from './hooks';
import { AppState } from './types';

const _useLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export async function waitForPageReady(appState: AppState, pagePath: string) {
  if (appState.pagePath === pagePath) {
    return;
  }

  const matches = matchRoutes(appState.routes, pagePath);

  if (!matches?.length) {
    return;
  }

  try {
    const modules = await Promise.all(
      matches.map(async m => (m.route as Route).component.preload?.())
    );

    const pageModule = modules.reduce(
      (all, current) => ({
        ...all,
        ...current,
      }),
      {}
    );

    // update app state
    appState.pagePath = pagePath;
    appState.pageData = appState.pagesData[pagePath];
    appState.pageModule = ref(pageModule);
    appState.pageError = null;
  } catch (err) {
    if (err instanceof Error) {
      appState.pageError = err;
    }
  } finally {
    appState.pageLoading = false;
  }
}

export function App() {
  const appState = useContext(appContext);
  const { pathname } = useLocation();

  _useLayoutEffect(() => {
    async function load() {
      const timer = setTimeout(() => {
        appState.pageLoading = true;
      }, 100);

      await waitForPageReady(appState, pathname);
      clearTimeout(timer);
    }

    load();
  }, [pathname, appState]);

  return (
    <MDXProvider components={appState.theme.mdxComponents}>
      <appState.theme.Layout />
    </MDXProvider>
  );
}
