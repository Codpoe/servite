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
    pagePath: string;
  };
}
