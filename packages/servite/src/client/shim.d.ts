declare module 'virtual:servite/pages' {
  import { Page } from '../shared/types';

  export const pages: Page[];
  export default pages;
}

declare module 'virtual:servite/pages-routes' {
  import { Route } from '../shared/types';

  export const routes: Route[];
  export default routes;
}

declare module 'virtual:servite/custom-server-render' {
  import { ReactElement } from 'react';
  import { SSREntryRenderResult } from '../shared/types';

  const render:
    | ((
        element: ReactElement
      ) => SSREntryRenderResult | Promise<SSREntryRenderResult>)
    | undefined;

  export default render;
}

declare const __HASH_ROUTER__: boolean;

type RouteObject = import('react-router-dom').RouteObject;

interface Window {
  __SERVITE__ssrData?: import('../shared/types').SSRData;

  // for islands
  __SERVITE__islands?: (() => any)[];
  __SERVITE__createElement: any;
  __SERVITE__createRoot: any;
  __SERVITE__hydrateRoot: any;

  // for hmr
  __SERVITE_mapRoutes__: (
    fn: (route: RouteObject) => RouteObject
  ) => Promise<RouteObject[]>;
  __SERVITE_dataFileUpdates__?: Set<string>;
  __SERVITE_routesUpdatePromise__?: Promise<any>;
  __SERVITE_routesUpdateResolve__?: () => void;
}
