declare module 'virtual:servite/pages' {
  export interface Page {
    routePath: string;
    filePath: string;
    isLayout: boolean;
    is404: boolean;
    exports: string[];
    meta: Record<string, any>;
  }

  export const pages: Page[];
  export default pages;
}

declare module 'virtual:servite/routes' {
  export interface Route {
    path: string;
    component: any;
    children?: Route[];
    meta?: Record<string, any>;
  }

  export const routes: Route[];
  export default routes;
}

declare module '/@pressify/theme*' {
  import { ComponentType } from 'react';
  import { Components } from '@mdx-js/react/lib';

  const theme: {
    Layout: ComponentType<any>;
    NotFound?: ComponentType<any>;
    mdxComponents?: Components;
  };

  export default theme;
}

declare const __HASH_ROUTER__: boolean;

interface Window {
  __SSR_DATA__?: {
    context: {
      serverRendered: boolean;
    };
    loaderData?: Record<string, any>;
  };
}
