export interface Page {
  routePath: string;
  filePath: string;
  isLayout: boolean;
  is404: boolean;
  exports: string[];
  meta: Record<string, any>;
}

export const pages: Page[];
export default pages;
