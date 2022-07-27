import type { Entry } from 'virtual:conventional-entries';
import type { PageData } from 'virtual:conventional-pages-data';

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

export type ServerEntryRender = (
  pathname: string,
  helmetContext: Record<string, unknown>
) => Promise<string>;

export interface ServerEntryExports {
  render: ServerEntryRender;
  entries: Entry[];
  pagesData: Record<string, PageData>;
}
