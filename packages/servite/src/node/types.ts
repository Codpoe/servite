import { Options as ReactOptions } from '@vitejs/plugin-react';
import { NitroConfig } from 'nitropack';

export interface PagesDir {
  base?: string;
  dir: string;
  ignore?: string[];
}

export interface ApiHandler {
  method: string;
  route: string;
}

export interface UserServiteConfig {
  /**
   * Directory for finding pages
   * @default [{ dir: 'src/pages' }]
   */
  pagesDirs?: PagesDir[];
  /**
   * Prerender routes (Static Site Generate)
   *
   * supports glob patterns
   * @default false
   */
  ssg?: boolean | string[];
  /**
   * Switch to CSR (Client Side Rendering)
   * @default false
   */
  csr?: boolean;
  api?: {
    /**
     * eg. `'@/utils/fetch'` -> `import _fetch from '@/utils/fetch'`
     */
    fetchImportSource?: string;
    /**
     * Fully custom API code for client
     */
    generateCode?: (handler: ApiHandler, originalCode: string) => string;
  };
  /**
   * Options of @vitejs/plugin-react
   */
  react?: ReactOptions;
  /**
   * Nitro config
   * @see https://github.com/unjs/nitro
   */
  nitro?: NitroConfig;
}

type PartialRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export interface ServiteConfig
  extends PartialRequired<UserServiteConfig, 'pagesDirs' | 'ssg' | 'csr'> {
  serverRenderFile?: string;
}
