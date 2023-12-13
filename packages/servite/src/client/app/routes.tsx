import type { RouteObject } from 'react-router-dom';
import { routes as children } from 'virtual:servite/pages-routes';
import { App } from './app';
import { ErrorBoundary } from './error';

export const routes: RouteObject[] = [
  {
    id: '',
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children,
  },
];
