import path from 'upath';
import {
  createNitro,
  NitroConfig,
  PublicAssetDir,
  ServerAssetDir,
} from 'nitropack';
import type { InlineConfig, ResolvedConfig, ViteDevServer } from 'vite';
import { DIST_DIR } from '../constants.js';
import type { ServiteConfig } from '../types.js';

export interface CreateServiteNitroConfig {
  serviteConfig: ServiteConfig;
  viteConfig: ResolvedConfig;
  viteDevServer?: ViteDevServer;
  nitroConfig?: NitroConfig;
}

export async function initNitro({
  viteConfig,
  nitroConfig,
}: CreateServiteNitroConfig) {
  const nitro = await createNitro({
    baseURL: viteConfig.base,
    rootDir: viteConfig.root,
    srcDir: 'src/server',
    serverAssets: getNitroServerAssets(viteConfig),
    publicAssets: getNitroPublicAssets(viteConfig),
    runtimeConfig: {
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
    // TODO: prerender
    prerender: {},
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
    // TODO: use defu
    ...nitroConfig,
  });

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
