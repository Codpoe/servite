import type { RouteObject } from 'react-router-dom';
import { pages } from 'virtual:servite/pages';
import { routes as children } from 'virtual:servite/pages-routes';
import { AppContextProvider } from './context';
import { App } from './app';
import { ErrorBoundary } from './error';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AppContextProvider value={{ pages, routes: children }}>
        <App />
      </AppContextProvider>
    ),
    errorElement: <ErrorBoundary />,
    children,
  },
];
