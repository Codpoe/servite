import { FilledContext } from 'react-helmet-async';

export interface UserServiteConfig {
  /**
   * Pages directory to find pages
   * @default 'src/pages'
   */
  pagesDir?: string;
  /**
   * Server side render
   * @default true
   */
  ssr?: boolean;
  /**
   * Static site generate
   * @default false
   */
  ssg?: boolean;
  /**
   * Use HashRouter instead of BrowserRouter
   * @default false
   */
  hashRouter?: boolean;
}

export interface ServiteConfig extends Required<UserServiteConfig> {}

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
  loader?: any;
}

export interface ServerEntryRenderContext {
  helmetContext: Partial<FilledContext>;
  loaderData?: Record<string, any>;
}

export type ServerEntryRender = (
  pathname: string,
  context: ServerEntryRenderContext
) => Promise<string>;

export interface ServerEntryExports {
  render: ServerEntryRender;
  pages: Page[];
}
