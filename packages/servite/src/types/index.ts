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
  $component: {
    src: string;
    pick: string[];
  };
  $data?: {
    src: string;
    pick: string[];
  };
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
