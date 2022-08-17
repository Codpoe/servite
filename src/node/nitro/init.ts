import path from 'upath';
import {
  createNitro,
  NitroConfig,
  PublicAssetDir,
  ServerAssetDir,
} from 'nitropack';
import type { InlineConfig, ResolvedConfig, ViteDevServer } from 'vite';
import { defu } from 'defu';
import { DIST_DIR } from '../constants.js';
import { ServiteConfig } from '../types.js';

export interface CreateServiteNitroConfig {
  serviteConfig: ServiteConfig;
  viteConfig: ResolvedConfig;
  viteDevServer?: ViteDevServer;
  nitroConfig?: NitroConfig;
}

export async function initNitro({
  serviteConfig,
  viteConfig,
  nitroConfig,
}: CreateServiteNitroConfig) {
  const nitro = await createNitro(
    defu(
      {
        baseURL: viteConfig.base,
        rootDir: viteConfig.root,
        srcDir: 'src/server',
        serverAssets: getNitroServerAssets(viteConfig),
        publicAssets: getNitroPublicAssets(viteConfig),
        // Pass some config to runtime/renderer
        runtimeConfig: {
          serviteConfig,
          viteDevServerConfig: <InlineConfig>{
            root: viteConfig.root,
            base: viteConfig.base,
            configFile: viteConfig.configFile,
            optimizeDeps: { force: viteConfig.optimizeDeps.force },
            server: viteConfig.server,
          },
        },
        renderer: path.resolve(DIST_DIR, 'server/runtime/renderer'),
        externals: {
          inline: [DIST_DIR, 'servite/server'],
        },
        typescript: {
          generateTsConfig: false,
        },
        virtual: {
          '#servite/prod-ssr-entry': () => {
            if (nitroConfig?.dev) {
              return `export const render = () => '';
export const pages = [];
`;
            }

            const ssrEntryPath = path.resolve(
              viteConfig.root,
              viteConfig.build.outDir,
              'ssr/entry.server.js'
            );
            return `export * from '${ssrEntryPath}';`;
          },
        },
      },
      nitroConfig,
      serviteConfig.nitro
    )
  );

  return nitro;
}

function getNitroServerAssets(viteConfig: ResolvedConfig): ServerAssetDir[] {
  if (viteConfig.command === 'serve') {
    return [];
  }

  return [
    {
      baseName: 'servite',
      dir: path.resolve(
        viteConfig.root,
        viteConfig.build.outDir,
        'server-assets'
      ),
    },
  ];
}

function getNitroPublicAssets(viteConfig: ResolvedConfig): PublicAssetDir[] {
  if (viteConfig.command === 'serve') {
    return [];
  }

  return [
    // vite public
    {
      dir: path.resolve(viteConfig.root, viteConfig.publicDir),
      maxAge: 0,
    },
    // vite client bundle assets
    {
      baseURL: viteConfig.build.assetsDir,
      dir: path.resolve(
        viteConfig.root,
        viteConfig.build.outDir,
        viteConfig.build.assetsDir
      ),
      maxAge: 60,
    },
  ];
}
