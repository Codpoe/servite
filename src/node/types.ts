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
