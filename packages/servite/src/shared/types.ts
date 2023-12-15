import type { H3Event } from 'h3';
import type { HelmetServerState } from 'react-helmet-async';
import type {
  RouteObject,
  LazyRouteFunction,
  Location,
  LoaderFunction,
  ActionFunction,
} from 'react-router-dom';
import type {
  StaticHandlerContext,
  createStaticHandler,
} from 'react-router-dom/server';

export interface Page {
  routePath: string;
  filePath: string;
  dataFilePath?: string;
  hasLoader?: boolean;
  hasAction?: boolean;
  isLayout: boolean;
  is404: boolean;
}

export interface Route {
  id: string;
  path: string;
  filePath: string;
  dataFilePath?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  module?: Record<string, any>;
  lazy?: LazyRouteFunction<RouteObject>;
  children?: Route[];
  __LAZY_PLACEHOLDER__?: string;
  __LOADER_PLACEHOLDER__?: string;
  __ACTION_PLACEHOLDER__?: string;
}

export interface RouteHandle {
  filePath: string;
  dataFilePath: string;
  module: Record<string, any>;
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
  routerHandler: ReturnType<typeof createStaticHandler>;
}

export interface SSRData {
  context: Omit<SSRContext, 'event'>;
  serverRendered: boolean;
  hasIslands: boolean;
  /**
   * react-router context. Only available in SSR
   */
  routerContext?: {
    location: Location;
    handles: RouteHandle[];
  };
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
