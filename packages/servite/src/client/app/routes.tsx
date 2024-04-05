import type { RouteObject } from 'react-router-dom';
import { routes as children } from 'virtual:servite/pages-routes';
import { App } from './app.js';
import { ErrorBoundary } from './error.js';

export const routes: RouteObject[] = [
  {
    id: '_',
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children,
  },
];
