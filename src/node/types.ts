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
   * Prerender routes (Static site generate)
   *
   * supports glob patterns
   * @default false
   */
  ssg?: boolean | string[];
  /**
   * Use HashRouter instead of BrowserRouter
   *
   * NOT IMPLEMENT
   * @default false
   */
  hashRouter?: boolean;
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
  extends PartialRequired<
    UserServiteConfig,
    'pagesDirs' | 'ssg' | 'hashRouter'
  > {
  serverRenderFile?: string;
}
