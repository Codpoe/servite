import { FilledContext } from 'react-helmet-async';

interface Page {
  routePath: string;
  filePath: string;
  isLayout: boolean;
  is404: boolean;
  meta: Record<string, any>;
}

interface SSREntryRenderContext {
  helmetContext: Partial<FilledContext>;
  loaderData?: Record<string, any>;
}

export const render: (
  pathname: string,
  context: SSREntryRenderContext
) => Promise<string>;

export const pages: Page[];
