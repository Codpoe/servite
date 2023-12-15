import {
  Outlet,
  useNavigation,
  UNSAFE_DataRouterContext,
} from 'react-router-dom';
import { pages } from 'virtual:servite/pages';
import { useContext, useMemo } from 'react';
import { useNProgress } from './hooks/useNProgress.js';
import { AppContextProvider, AppContextValue } from './context.js';

export function App() {
  const dataRouterContext = useContext(UNSAFE_DataRouterContext);
  const navigation = useNavigation();

  const appContextValue: AppContextValue = useMemo(
    () => ({
      pages,
      router: dataRouterContext!.router,
    }),
    [dataRouterContext]
  );

  // TODO: May not require nprogress
  useNProgress(navigation.state === 'loading', 200);

  return (
    <AppContextProvider value={appContextValue}>
      <Outlet />
    </AppContextProvider>
  );
}
