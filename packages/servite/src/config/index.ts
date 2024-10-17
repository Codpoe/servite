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
import { mdxPlus } from 'vite-plugin-mdx-plus';
import isGlob from 'is-glob';
import micromatch from 'micromatch';
import { defaults, toArray } from '../utils/index.js';
import { PageFsRoute, RouterName } from '../types/index.js';
import { hmr } from '../plugins/hmr.js';
import { unifiedInvocation } from '../plugins/unified-invocation.js';
import { islands } from '../plugins/islands.js';
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

export function defineConfig({
  name = 'servite',
  root = process.cwd(),
  routers,
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
    baseURL: '/',
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

  const routerServerBase = routers?.[RouterName.Server]?.base || '/';
  const routerSSRBase = routers?.[RouterName.SSR]?.base || '/';
  const routerClientBase = routers?.[RouterName.Client]?.base || '/_build';

  const getDefines = (routerName: RouterName): Record<string, any> => ({
    'import.meta.env.SERVER_BASE_URL': JSON.stringify(
      server.baseURL.replace(/\/$/, ''),
    ),
    'import.meta.env.SERVER_BASE': JSON.stringify(server.baseURL),
    'import.meta.env.ROUTER_SERVER_BASE': JSON.stringify(routerServerBase),
    'import.meta.env.ROUTER_SSR_BASE': JSON.stringify(routerSSRBase),
    'import.meta.env.ROUTER_NAME': JSON.stringify(routerName),
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
        ...routers?.[RouterName.Public],
      },
      {
        name: RouterName.Client,
        type: 'client',
        target: 'browser',
        base: routerClientBase,
        handler: fileURLToPath(
          new URL('../ssr/client-handler.js', import.meta.url),
        ),
        routes: (router, app) =>
          new PagesFsRouter(
            {
              base: routerSSRBase,
              dir: resolvedPagesDir,
              extensions: ['tsx', 'ts', 'jsx', 'js', 'mdx', 'md'],
            },
            router,
            app,
          ),
        ...routers?.[RouterName.Client],
        plugins: async (): Promise<Plugin[]> => [
          islands(),
          viteTsConfigPaths(userConfig.viteTsConfigPaths),
          mdxPlus({ providerImportSource: 'servite/runtime/mdx' }),
          viteReact({
            ...userConfig.viteReact,
            include: /\.([tj]s|md)x?$/,
            exclude: toArray(userConfig.viteReact?.exclude).concat(
              fileURLToPath(new URL('../ssr/routes.js', import.meta.url)),
            ),
          }),
          serverFunctions.client(),
          config('servite-client-config', () => ({
            define: {
              ...getDefines(RouterName.Client),
              __META_ENV_SSR__: JSON.stringify(false),
            },
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
          ...((await routers?.[RouterName.Client]?.plugins?.()) ?? []),
        ],
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
              base: routerServerBase,
              dir: resolvedServerRoutesDir,
              middlewaresDir: resolvedMiddlewaresDir,
              extensions: ['ts', 'js'],
            },
            router,
            app,
          ),
        ...routers?.[RouterName.Server],
        // Force the server base to be set to '/',
        // so that this handler can also match SSR.
        // It would be useful for modifying the SSR request and response
        base: '/',
        plugins: () => [
          viteTsConfigPaths(userConfig.viteTsConfigPaths),
          config('servite-server-config', () => ({
            define: {
              ...getDefines(RouterName.Server),
            },
          })),
        ],
      },
      serverFunctions.router({
        ...(routers?.[RouterName.ServerFns] as any),
        name: RouterName.ServerFns,
        // Force the ssr base to be set to '/',
        // so that the server middlewares can also run in server-fns.
        base: '/',
        handler: fileURLToPath(
          new URL('../server-fns/handler.js', import.meta.url),
        ),
        plugins: () => [
          viteTsConfigPaths(userConfig.viteTsConfigPaths),
          config('servite-server-fns-config', () => ({
            define: {
              ...getDefines(RouterName.ServerFns),
            },
          })),
        ],
      }),
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
              base: routerSSRBase,
              dir: resolvedPagesDir,
              extensions: ['tsx', 'ts', 'jsx', 'js', 'mdx', 'md'],
            },
            router,
            app,
          ),
        ...routers?.[RouterName.SSR],
        // Force the ssr base to be set to '/',
        // so that the server middlewares can also run in SSR.
        base: '/',
        plugins: async () => [
          islands(),
          viteTsConfigPaths(userConfig.viteTsConfigPaths),
          mdxPlus({ providerImportSource: 'servite/runtime/mdx' }),
          viteReact(userConfig.viteReact),
          config('servite-ssr-config', () => ({
            define: {
              ...getDefines(RouterName.SSR),
              __META_ENV_SSR__: JSON.stringify(true),
            },
            // ssr: {
            //   // The package.json "type" of react-helmet-async is not "module",
            //   // but its ES format file extension is not "mjs",
            //   // so nodejs parsing will fail, and we need to handle it through vite
            //   noExternal: ['react-helmet-async'],
            // },
            // Set `base` here to make the SSR asset url consistent with the client
            base: routerClientBase,
          })),
          unifiedInvocation({
            app,
            srcDir: resolvedSrcDir,
            serverDir: resolvedServerDir,
            serverRoutesDir: resolvedServerRoutesDir,
          }),
          ...((await routers?.[RouterName.SSR]?.plugins?.()) ?? []),
        ],
      },
    ],
  });

  app.hooks.hook('app:build:nitro:config', ({ nitro }: any) => {
    nitro.hooks.hook('prerender:routes', async (routes: Set<string>) => {
      const _routes = [...routes];
      const globRoutes: string[] = [];
      routes.clear();

      for (const route of _routes) {
        if (isGlob(route)) {
          globRoutes.push(route);
        } else {
          // prepend ssr baseURL to route
          routes.add(join(server.baseURL, routerSSRBase, route));
        }
      }

      // add routePath if matches glob pattern
      if (globRoutes.length) {
        const certainPageFsRoutePaths = (
          (await app
            .getRouter(RouterName.SSR)
            .internals.routes?.getRoutes()) as PageFsRoute[]
        )
          .filter(
            x =>
              !x.isLayout &&
              !x.routePath.includes('/*') &&
              !x.routePath.includes('/:'),
          )
          .map(x => x.routePath);

        micromatch(certainPageFsRoutePaths, globRoutes).forEach(x => {
          routes.add(join(server.baseURL, x));
        });
      }
    });
  });

  return app;
}
