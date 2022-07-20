import { proxy, ref, snapshot, subscribe } from 'valtio';
import _theme from '/@pressify/theme';
import _routes from 'virtual:conventional-routes';
import pagesData from 'virtual:conventional-pages-data';
import { appContext } from './hooks';
import { AppState } from './types';

// pressify build will inject global variable: `__PRESSIFY_SSR_DATA__`
export const ssrData =
  typeof window !== 'undefined' ? window.__PRESSIFY_SSR_DATA__ : undefined;

export function createAppState() {
  const theme = {
    NotFound: () => <>404 Not Found</>,
    ..._theme,
  };

  const routes = _routes.concat({
    path: '*',
    component: theme.NotFound,
    element: <theme.NotFound />,
  });

  const appState = proxy<AppState>({
    theme: ref(theme),
    routes: ref(routes),
    pagesData: ref(pagesData),
    pageLoading: false,
    pageError: null,
  });

  const AppStateProvider = ({ children }: { children?: React.ReactNode }) => (
    <appContext.Provider value={appState}>{children}</appContext.Provider>
  );

  if (import.meta.env.DEV) {
    subscribe(appState, () => {
      if (appState) {
        // eslint-disable-next-line no-console
        console.log('[pressify:appState]', snapshot(appState));
      }
    });
  }

  return { appState, AppStateProvider };
}
