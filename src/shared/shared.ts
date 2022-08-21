import type { CompatibilityEvent } from 'h3';
import type { FilledContext } from 'react-helmet-async';

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
  element: any;
  children?: Route[];
  meta?: Record<string, any>;
}

export interface SSRContext {
  event: CompatibilityEvent;
  url: string;
  pathname: string;
  noSSR: boolean;
}

export interface SSREntryRenderContext {
  ssrContext: SSRContext;
  helmetContext: Partial<FilledContext>;
  loaderData?: any;
}

export type SSREntryRender = (
  context: SSREntryRenderContext
) => Promise<string>;

export interface SSREntry {
  render: SSREntryRender;
  pages: Page[];
}

export interface SSRData {
  context: Omit<SSRContext, 'event'>;
  serverRendered: boolean;
  loaderData?: any;
}

export interface LoaderBaseContext {
  url: string;
  pathname: string;
  search: string;
  hash: string;
  query: Record<string, any>;
  params: Record<string, any>;
}

export interface LoaderServerContext extends LoaderBaseContext {
  isBrowser: false;
  event: CompatibilityEvent;
}

export interface LoaderClientContext extends LoaderBaseContext {
  isBrowser: true;
}

export type LoaderContext = LoaderServerContext | LoaderClientContext;
