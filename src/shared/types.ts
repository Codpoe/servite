import type { H3Event } from 'h3';
import type { FilledContext } from 'react-helmet-async';
import type { RouteMatch } from 'react-router-dom';

export interface Page {
  routePath: string;
  filePath: string;
  isLayout: boolean;
  is404: boolean;
  meta: Record<string, any>;
}

export interface Route {
  path: string;
  filePath: string;
  component: any;
  element: any;
  children?: Route[];
  meta?: Record<string, any>;
}

export interface SSRContext {
  event: H3Event;
  url: string;
  pathname: string;
  noSSR: boolean;
}

export interface Island {
  type: IslandType;
  component: string;
}

export type IslandType = 'load' | 'idle' | 'visible' | 'media';

export interface SSREntryRenderContext {
  ssrContext: SSRContext;
  helmetContext: Partial<FilledContext>;
  routeMatches?: RouteMatch[];
  islands?: Island[];
  loaderData?: any[];
}

export interface SSREntryRenderResult {
  appHtml: string;
  headTags?: string;
}

export type SSREntryRender = (
  context: SSREntryRenderContext
) => Promise<SSREntryRenderResult>;

export interface SSREntry {
  render: SSREntryRender;
  pages: Page[];
}

export interface SSRData {
  context: Omit<SSRContext, 'event'>;
  serverRendered: boolean;
  loaderData?: any[];
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
  event: H3Event;
}

export interface LoaderClientContext extends LoaderBaseContext {
  isBrowser: true;
}

export type LoaderContext = LoaderServerContext | LoaderClientContext;
