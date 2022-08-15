import type { FilledContext } from 'react-helmet-async';

export interface Page {
  routePath: string;
  filePath: string;
  isLayout: boolean;
  is404: boolean;
  meta: Record<string, any>;
}

export interface SSREntryRenderContext {
  helmetContext: Partial<FilledContext>;
  loaderData?: Record<string, any>;
}

export type SSREntryRender = (
  pathname: string,
  context: SSREntryRenderContext
) => Promise<string>;

export interface SSREntry {
  render: SSREntryRender;
  pages: Page[];
}
