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

  export const render:
    | ((
        element: ReactElement
      ) => SSREntryRenderResult | Promise<SSREntryRenderResult>)
    | undefined;
}

declare const __HASH_ROUTER__: boolean;

interface Window {
  __SERVITE__ssrData?: import('../shared/types').SSRData;
  __SERVITE__islands?: (() => any)[];
  __SERVITE__createElement: any;
  __SERVITE__createRoot: any;
  __SERVITE__hydrateRoot: any;
}
