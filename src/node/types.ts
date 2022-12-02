import { NitroConfig } from 'nitropack';

export interface PagesDir {
  base?: string;
  dir: string;
  ignore?: string[];
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
