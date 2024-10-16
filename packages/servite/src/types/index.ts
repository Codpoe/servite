import type { H3Event } from 'vinxi/http';

export enum RouterName {
  Public = 'public',
  SPA = 'spa',
  Client = 'client',
  SSR = 'ssr',
  Server = 'server',
  ServerFns = 'server-fns',
}

export interface PageFsRoute {
  /**
   * Servite doesn't actually use this field,
   * but it's the key for FsRoute.
   * So we need to mark it as deprecated.
   * @deprecated
   */
  path: string;
  /**
   * the route path of the page,
   */
  routePath: string;
  filePath: string;
  isMd?: boolean;
  isLayout?: boolean;
  hasLoader?: boolean;
  hasAction?: boolean;
  hasErrorBoundary?: boolean;
  handle?: Record<string, any>;
  $component: {
    src: string;
    pick: string[];
  };
  $data?: {
    src: string;
    pick: string[];
  };
  /**
   * static handle (for js page)
   */
  $$handle?: {
    src: string;
    pick: string[];
  };
}

export interface ServerFsRoute {
  /**
   * Servite doesn't actually use this field,
   * but it's the key for FsRoute.
   * So we need to mark it as deprecated.
   * @deprecated
   */
  path: string;
  /**
   * the route path of the endpoint
   */
  routePath: string;
  filePath: string;
  method?: string;
  $handler?: {
    src: string;
    pick: string[];
  };
  $$middleware?: {
    src: string;
    pick: string[];
  };
}

export interface FsRouteMod {
  src: string;
  import: () => Promise<any>;
  require: () => any;
}

type FsRouteModule<T extends Record<string, any>> = {
  [P in keyof T]: P extends `$${string}` ? FsRouteMod : T[P];
};

export type PageFsRouteModule = FsRouteModule<PageFsRoute>;
export type ServerFsRouteModule = FsRouteModule<ServerFsRoute>;

export interface Middleware {
  (event: H3Event, next: () => Promise<void>): void | Promise<void>;
}

export interface HtmlTag {
  tag: string;
  injectTo: 'head' | 'head-prepend' | 'body' | 'body-prepend';
  attrs?: Record<string, any>;
  children?: string | HtmlTag[];
}

export type HtmlTagWithoutInjectTo = Omit<HtmlTag, 'injectTo'>;

export interface HtmlTransformer {
  (html: string): string | Promise<string>;
}
