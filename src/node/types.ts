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
   * theme
   */
  theme?: string;
  /**
   * Server side render
   * @default true
   */
  ssr?: boolean | string[];
  /**
   * Static site generate
   * @default false
   */
  ssg?: boolean | string[];
  /**
   * Use HashRouter instead of BrowserRouter
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
    'pagesDirs' | 'ssr' | 'ssg' | 'hashRouter'
  > {}

export interface Page {
  routePath: string;
  filePath: string;
  isLayout: boolean;
  is404: boolean;
  meta: Record<string, any>;
}

export interface Route {
  path: string;
  component: any;
  children?: Route[];
  meta?: Record<string, any>;
}
