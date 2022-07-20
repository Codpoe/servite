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

declare module '/@pressify/theme-config*' {
  const themeConfig: any;

  export default themeConfig;
}

declare const __HASH_ROUTER__: boolean;

interface Window {
  __PRESSIFY_SSR_DATA__?: {
    pagePath: string;
    assetPath: string;
    pageModule?: any;
  };
}
