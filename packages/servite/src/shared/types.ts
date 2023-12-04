import type { H3Event } from 'h3';
import type { HelmetServerState } from 'react-helmet-async';
import type { RouteObject, LazyRouteFunction } from 'react-router-dom';
import type { StaticHandlerContext } from 'react-router-dom/server';

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
  module?: Record<string, any>;
  lazy?: LazyRouteFunction<RouteObject>;
  children?: Route[];
  meta?: Record<string, any>;
  __LAZY_PLACEHOLDER__?: string;
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
  helmetContext?: {
    helmet: HelmetServerState;
  };
  routerContext?: StaticHandlerContext;
  islands?: Island[];
}

export interface SSREntryRenderResult {
  appHtml: string;
  headTags?: string;
}

export type SSREntryRender = (
  context: SSREntryRenderContext
) => Promise<SSREntryRenderResult | undefined>;

export interface SSREntry {
  render: SSREntryRender;
  pages: Page[];
  routes: Route[];
}

export interface SSRData {
  context: Omit<SSRContext, 'event'>;
  serverRendered: boolean;
  hasIslands: boolean;
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
