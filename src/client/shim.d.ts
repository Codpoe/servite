declare module 'virtual:servite/pages*' {
  export interface Page {
    routePath: string;
    filePath: string;
    isLayout: boolean;
    is404: boolean;
    meta: Record<string, any>;
  }

  export const pages: Page[];
  export default pages;
}

declare module 'virtual:servite/pages-routes*' {
  export interface Route {
    path: string;
    component: any;
    children?: Route[];
    meta?: Record<string, any>;
  }

  export const routes: Route[];
  export default routes;
}

declare module 'virtual:servite/theme' {
  import { ComponentType } from 'react';

  const theme: ComponentType<any>;
  export default theme;
}

declare const __HASH_ROUTER__: boolean;

interface Window {
  __SSR_DATA__?: {
    context: {
      url: string;
      parsedUrl: {
        protocol: string;
        host: string;
        pathname: string;
        query: QueryObject;
        hash: string;
      };
      noSSR: boolean;
    };
    serverRendered: boolean;
    loaderData?: any;
  };
}
