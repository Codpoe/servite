import path from 'upath';
import {
  createNitro,
  type NitroConfig,
  type PublicAssetDir,
  type ServerAssetDir,
} from 'nitropack';
import type { InlineConfig, ResolvedConfig } from 'vite';
import { defu } from 'defu';
import { DIST_DIR, SERVER_RENDERER_PATH } from '../constants.js';
import type { ServiteConfig } from '../types.js';

export interface CreateServiteNitroConfig {
  serviteConfig: ServiteConfig;
  viteConfig: ResolvedConfig;
  nitroConfig?: NitroConfig;
}

export async function initNitro({
  serviteConfig,
  viteConfig,
  nitroConfig,
}: CreateServiteNitroConfig) {
  const nitro = await createNitro(
    defu<NitroConfig, (NitroConfig | undefined)[]>(
      nitroConfig,
      serviteConfig.nitro,
      {
        baseURL: viteConfig.base,
        rootDir: viteConfig.root,
        srcDir: path.resolve(viteConfig.root, 'src/server'),
        buildDir: path.resolve(viteConfig.root, 'node_modules/.servite'),
        output: {
          dir: path.resolve(
            viteConfig.root,
            viteConfig.build.outDir,
            '.output'
          ),
        },
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
        renderer: SERVER_RENDERER_PATH,
        externals: {
          inline: [DIST_DIR, 'servite/server'],
        },
        typescript: {
          generateTsConfig: false,
        },
        virtual: {
          'virtual:servite/prod-ssr-entry': () => {
            if (nitroConfig?.dev || serviteConfig.csr) {
              return `export const render = () => '';
export const pages = [];
export const routes = [];
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
      }
    )
  );

  return nitro;
}

function getNitroServerAssets(viteConfig: ResolvedConfig): ServerAssetDir[] {
  if (viteConfig.command === 'serve') {
    return [];
  }

  return [
    // extra server assets
    {
      // In runtime we can get .output/server-assets/xxx by `useStorage().get('assets/servite/xxx')`
      baseName: 'servite',
      dir: path.resolve(
        viteConfig.root,
        viteConfig.build.outDir,
        '.output/server-assets'
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
      maxAge: 60 * 60 * 24 * 365, // 1 year
    },
  ];
}
