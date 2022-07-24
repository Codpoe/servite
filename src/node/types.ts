export interface ServiteConfig {
  /**
   * Pages directory to find pages
   * @default 'src/pages'
   */
  pagesDir?: string;
  /**
   * SSR
   * @default true
   */
  ssr?: boolean;
  /**
   * Use HashRouter instead of BrowserRouter
   * @default false
   */
  hashRouter?: boolean;
}
