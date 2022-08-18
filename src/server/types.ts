import type { CompatibilityEvent } from 'h3';
import type { QueryObject } from 'ufo';
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
  loaderContext: LoaderContext;
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

export interface SSRContext {
  event: CompatibilityEvent;
  url: string;
  parsedUrl: {
    protocol: string;
    host: string;
    pathname: string;
    query: QueryObject;
    hash: string;
  };
  noSSR: boolean;
}

export interface SSRData {
  context: Omit<SSRContext, 'event'>;
  serverRendered: boolean;
  loaderData?: Record<string, any>;
}

export interface LoaderServerContext extends SSRContext {
  isServer: true;
}

export interface LoaderClientContext extends Omit<SSRContext, 'event'> {
  isServer: false;
}

export type LoaderContext = LoaderServerContext | LoaderClientContext;
