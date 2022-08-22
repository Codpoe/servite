declare module 'virtual:servite/pages' {
  import { Page } from './shared';

  export const pages: Page[];
  export default pages;
}

declare module 'virtual:servite/pages-routes' {
  import { Route } from './shared';

  export const routes: Route[];
  export default routes;
}

declare module 'virtual:servite/theme' {
  import { ComponentType } from 'react';

  const theme: ComponentType<any> | undefined;
  export default theme;
}

declare const __HASH_ROUTER__: boolean;

interface Window {
  __SSR_DATA__?: import('./shared').SSRData;
}
