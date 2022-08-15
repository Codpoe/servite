import path from 'upath';
import fs from 'fs-extra';
import { createNitro, NitroConfig } from 'nitropack';
import type { InlineConfig, ResolvedConfig, ViteDevServer } from 'vite';
import { DIST_DIR } from './constants.js';
import type { ServiteConfig } from './types.js';

export interface CreateServiteNitroConfig {
  serviteConfig: ServiteConfig;
  viteConfig: ResolvedConfig;
  viteDevServer?: ViteDevServer;
  nitroConfig: NitroConfig;
}

export async function initNitro({
  viteConfig,
  nitroConfig,
}: CreateServiteNitroConfig) {
  const vitePublicDir = getVitePublicDir(viteConfig);

  const nitro = await createNitro({
    ...nitroConfig,
    rootDir: viteConfig.root,
    srcDir: 'src/server',
    buildDir: viteConfig.build.outDir,
    publicAssets: vitePublicDir ? [{ dir: vitePublicDir }] : [],
    storage: {
      'servite-dist': {
        driver: 'fs',
        base: DIST_DIR,
      },
      'vite-out': {
        driver: 'fs',
        base: path.resolve(viteConfig.root, viteConfig.build.outDir),
      },
    },
    // For src/server/runtime
    virtual: {
      '#servite/vite-dev-server-config': () => {
        const inlineConfig: InlineConfig = {
          root: viteConfig.root,
          base: viteConfig.base,
          configFile: viteConfig.configFile,
          optimizeDeps: { force: viteConfig.optimizeDeps.force },
          server: viteConfig.server,
        };

        return `export default ${JSON.stringify(inlineConfig)};`;
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
  });

  return nitro;
}

function getVitePublicDir(viteConfig: ResolvedConfig): string | undefined {
  const rootPublicDir = path.resolve(viteConfig.root, viteConfig.publicDir);

  if (!fs.existsSync(rootPublicDir)) {
    return undefined;
  }
  return rootPublicDir;
}
