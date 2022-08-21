import path from 'upath';
import fs from 'fs-extra';
import { build as viteBuild, InlineConfig, ResolvedConfig } from 'vite';
import {
  build as nitroBuild,
  copyPublicAssets,
  prepare,
  prerender,
} from 'nitropack';
import { initNitro } from '../nitro/init.js';
import { SSR_ENTRY_FILE } from '../constants.js';
import { ServiteConfig } from '../types.js';
import { Page } from '../shared.js';

export async function build(inlineConfig: InlineConfig) {
  let viteConfig = {} as ResolvedConfig;
  let serviteConfig = {} as ServiteConfig;
  let outDir = 'dist';
  let pages: Page[] = [];

  const getPlugin = (name: string) => {
    const plugin = viteConfig.plugins.find(p => p.name === name);
    if (!plugin) {
      throw new Error(`vite plugin "${name}" not found`);
    }
    return plugin;
  };

  const resolveInlineConfig = (ssr: boolean): InlineConfig => {
    return {
      ...inlineConfig,
      plugins: [
        ...(inlineConfig.plugins || []),
        {
          name: 'servite:build',
          enforce: 'post',
          async configResolved(config) {
            viteConfig = config;

            // Save servite config
            serviteConfig = getPlugin('servite').api.getServiteConfig();

            // Save some config for generate bootstrap code and ssg
            ({ outDir } = config.build);

            // Redirect ssr outDir to {outDir}/ssr.
            config.build.outDir = ssr ? path.join(outDir, 'ssr') : outDir;

            // Save pages to prerender
            pages = await getPlugin('servite:pages').api.getPages();
          },
        },
      ],
      build: {
        ...inlineConfig.build,
        ssr: ssr ? SSR_ENTRY_FILE : false,
        ssrManifest: !ssr, // generate ssr manifest while client bundle
      },
    };
  };

  // Client bundle
  await viteBuild(resolveInlineConfig(false));

  emptyLine();

  // SSR bundle
  await viteBuild(resolveInlineConfig(true));

  emptyLine();

  // Build nitro output
  const nitro = await initNitro({
    serviteConfig,
    viteConfig: {
      ...viteConfig,
      build: {
        ...viteConfig.build,
        // SSR bundle will overwrite outDir, here we need to restore the original outDir
        outDir,
      },
    },
    nitroConfig: {
      dev: false,
      prerender: {
        routes: pages.map(p => p.routePath),
      },
    },
  });

  await prepare(nitro);

  // Copy some client bundle result to server assets
  // renderer will read server-assets by useStorage().getItem('/assets/servite/...')
  await copyServerAssets(viteConfig, outDir);

  await copyPublicAssets(nitro);
  await prerender(nitro);
  await nitroBuild(nitro);
  await nitro.close();
}

function emptyLine() {
  // eslint-disable-next-line no-console
  console.log('');
}

async function copyServerAssets(viteConfig: ResolvedConfig, outDir: string) {
  await Promise.all(
    ['index.html', 'ssr-manifest.json'].map(filePath =>
      fs.copy(
        path.resolve(viteConfig.root, outDir, filePath),
        path.resolve(viteConfig.root, outDir, 'server-assets', filePath)
      )
    )
  );
}
