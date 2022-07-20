export interface ServiteConfig {
  /**
   * Server entry file path
   */
  serverEntry?: string;
  /**
   * Client root layout file path
   */
  rootLayout?: string;
}

export interface ResolvedServiteConfig extends ServiteConfig {}
