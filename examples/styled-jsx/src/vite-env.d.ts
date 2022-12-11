/// <reference types="vite/client" />
/// <reference types="styled-jsx/global" />

import 'react';

declare module 'react' {
  interface Attributes {
    __island?: 'load' | 'idle' | 'visible' | 'media';
    __islandOpts?: string;
    __islandClient?: boolean;
  }
}
