import { fileURLToPath } from 'url';
import {
  App,
  AppOptions,
  ClientRouterSchema,
  createApp,
  HTTPRouterSchema,
  Plugin,
  StaticRouterSchema,
} from 'vinxi';
import { config } from 'vinxi/plugins/config';
import { serverFunctions } from '@vinxi/server-functions/plugin';
import { resolve, join } from 'pathe';
import viteReact, { Options as ViteReactOptions } from '@vitejs/plugin-react';
import viteTsConfigPaths, {
  PluginOptions as ViteTsConfigPathsOptions,
} from 'vite-tsconfig-paths';
import { defaults, toArray } from '../utils/index.js';
import { RouterName } from '../types/index.js';
import { hmr } from '../plugins/hmr.js';
import { unifiedInvocation } from '../plugins/unified-invocation.js';
import { PagesFsRouter, ServerFsRouter } from './fs-router.js';

export { RouterName };

interface SourceConfig {
  /**
   * source code dir (relative to `root`)
   * @default './src'
   */
  srcDir?: string;
  /**
   * react-router pages dir (relative to `srcDir`)
   * @default './pages'
   */
  pagesDir?: string;
  /**
   * server code dir (relative to `srcDir`)
   * @default './server'
   */
  serverDir?: string;
  /**
   * server routes dir (relative to `serverDir`)
   * @default './routes'
   */
  serverRoutesDir?: string;
  /**
   * server middlewares dir (relative to `serverDir`)
   * @default './middlewares'
   */
  serverMiddlewaresDir?: string;
  /**
   * public assets dir (relative to `root`)
   * @default './public'
   */
  publicDir?: string;
}

type ServerConfig = NonNullable<AppOptions['server']>;

interface RoutersConfig {
  [RouterName.Public]?: Partial<StaticRouterSchema>;
  [RouterName.Server]?: Partial<HTTPRouterSchema>;
  [RouterName.SSR]?: Partial<HTTPRouterSchema>;
  [RouterName.ServerFns]?: Partial<HTTPRouterSchema>;
  [RouterName.Client]?: Partial<ClientRouterSchema>;
  [RouterName.SPA]?: Partial<ClientRouterSchema>;
}

export interface ServiteConfig {
  /**
   * app name
   * @default 'servite'
   */
  name?: string;
  /**
   * fs root
   * @default process.cwd()
   */
  root?: string;
  /**
   * source config
   */
  source?: SourceConfig;
  /**
   * routers config
   */
  routers?: RoutersConfig;
  /**
   * nitro server config
   */
  server?: ServerConfig;
  /**
   * options of `@vitejs/plugin-react`
   */
  viteReact?: ViteReactOptions;
  /**
   * options of `vite-tsconfig-paths`
   */
  viteTsConfigPaths?: ViteTsConfigPathsOptions;
}

// TODO: spa
export function defineConfig({
  name = 'servite',
  root = process.cwd(),
  ...userConfig
}: ServiteConfig = {}): App {
  root = resolve(root);

  const source = defaults(userConfig.source, {
    srcDir: './src',
    pagesDir: './pages',
    serverDir: './server',
    serverRoutesDir: './routes',
    serverMiddlewaresDir: './middlewares',
    publicDir: './public',
  });

  const server = defaults(userConfig.server, {
    routeRules: {
      '/_build/assets/**': {
        headers: { 'cache-control': 'public, immutable, max-age=31536000' },
      },
    },
    experimental: {
      asyncContext: true,
    },
  });

  const resolvedSrcDir = resolve(root, source.srcDir);
  const resolvedPagesDir = resolve(resolvedSrcDir, source.pagesDir);
  const resolvedServerDir = resolve(resolvedSrcDir, source.serverDir);
  const resolvedServerRoutesDir = resolve(
    resolvedServerDir,
    source.serverRoutesDir,
  );
  const resolvedMiddlewaresDir = resolve(
    resolvedServerDir,
    source.serverMiddlewaresDir,
  );

  const getDefines = (app: App): Record<string, any> => ({
    'import.meta.env.ROUTER_SERVER_BASE_URL': JSON.stringify(
      join(server.baseURL || '/', app.getRouter(RouterName.Server).base),
    ),
    'import.meta.env.ROUTER_SSR_BASE_URL': JSON.stringify(
      join(server.baseURL || '/', app.getRouter(RouterName.SSR).base),
    ),
    'import.meta.env.ROUTER_CLIENT_BASE_URL': JSON.stringify(
      join(server.baseURL || '/', app.getRouter(RouterName.Client).base),
    ),
  });

  const app = createApp({
    name,
    root,
    server,
    routers: [
      {
        name: RouterName.Public,
        type: 'static',
        dir: source.publicDir,
        ...userConfig.routers?.[RouterName.Public],
      },
      {
        name: RouterName.Server,
        type: 'http',
        target: 'server',
        handler: fileURLToPath(
          new URL('../server/handler.js', import.meta.url),
        ),
        routes: (router, app) =>
          new ServerFsRouter(
            {
              dir: resolvedServerRoutesDir,
              middlewaresDir: resolvedMiddlewaresDir,
              extensions: ['ts', 'js'],
            },
            router,
            app,
          ),
        ...userConfig.routers?.[RouterName.Server],
      },
      {
        name: RouterName.SSR,
        type: 'http',
        target: 'server',
        handler: fileURLToPath(
          new URL('../ssr/ssr-handler.js', import.meta.url),
        ),
        routes: (router, app) =>
          new PagesFsRouter(
            {
              dir: resolvedPagesDir,
              extensions: ['tsx', 'ts', 'jsx', 'js'],
            },
            router,
            app,
          ),
        ...userConfig.routers?.[RouterName.SSR],
        plugins: async () => [
          viteTsConfigPaths(userConfig.viteTsConfigPaths),
          viteReact(userConfig.viteReact),
          config('servite-ssr-config', () => ({
            define: getDefines(app),
            ssr: {
              // The package.json "type" of react-helmet-async is not "module",
              // but its ES format file extension is not "mjs",
              // so nodejs parsing will fail, and we need to handle it through vite
              noExternal: ['react-helmet-async'],
            },
          })),
          unifiedInvocation({
            app,
            srcDir: resolvedSrcDir,
            serverDir: resolvedServerDir,
            serverRoutesDir: resolvedServerRoutesDir,
          }),
          ...((await userConfig.routers?.[RouterName.SSR]?.plugins) ?? []),
        ],
      },
      {
        name: RouterName.Client,
        type: 'client',
        target: 'browser',
        base: '/_build',
        handler: fileURLToPath(
          new URL('../ssr/client-handler.js', import.meta.url),
        ),
        routes: (router, app) =>
          new PagesFsRouter(
            {
              dir: resolvedPagesDir,
              extensions: ['tsx', 'ts', 'jsx', 'js'],
            },
            router,
            app,
          ),
        ...userConfig.routers?.[RouterName.Client],
        plugins: async (): Promise<Plugin[]> => [
          viteTsConfigPaths(userConfig.viteTsConfigPaths),
          viteReact({
            ...userConfig.viteReact,
            exclude: toArray(userConfig.viteReact?.exclude).concat(
              fileURLToPath(new URL('../ssr/routes.js', import.meta.url)),
            ),
          }),
          serverFunctions.client(),
          config('servite-client-config', () => ({
            define: getDefines(app),
            optimizeDeps: {
              entries: [
                fileURLToPath(
                  new URL('../ssr/client-handler.js', import.meta.url),
                ),
              ],
            },
          })),
          hmr({ app }),
          unifiedInvocation({
            app,
            srcDir: resolvedSrcDir,
            serverDir: resolvedServerDir,
            serverRoutesDir: resolvedServerRoutesDir,
          }),
          ...((await userConfig.routers?.[RouterName.Client]?.plugins) ?? []),
        ],
      },
      {
        ...serverFunctions.router(
          userConfig.routers?.[RouterName.ServerFns] as any,
        ),
        name: RouterName.ServerFns,
      },
    ],
  });

  return app;
}
