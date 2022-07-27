import path from 'upath';
import fs from 'fs-extra';
import { build as viteBuild, InlineConfig } from 'vite';
import { RollupOutput } from 'rollup';
import { SSR_ENTRY_FILE } from '../constants.js';
import { ServiteConfig } from '../types.js';
import { ssg } from './ssg.js';

async function generateBootstrap(outDir: string) {
  const code = `import * as path from 'path';
import { createServerApp } from 'servite/server';

process.env.NODE_ENV = 'production';

function bootstrap() {
  const app = createServerApp({
    resolve(...paths) {
      return path.resolve('${outDir}', ...paths);
    },
    ssr: true,
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log('start servite app on ' + port);
  });
}

bootstrap();
`;

  const bootstrapFilePath = path.resolve(outDir, 'bootstrap.js');

  await fs.outputFile(bootstrapFilePath, code);
}

export async function build(inlineConfig: InlineConfig) {
  let serviteConfig = {} as ServiteConfig;
  let root = '';
  let outDir = 'dist';

  const resolveInlineConfig = (ssr: boolean): InlineConfig => {
    return {
      ...inlineConfig,
      plugins: [
        ...(inlineConfig.plugins || []),
        {
          name: 'servite:build',
          enforce: 'post',
          configResolved(config) {
            const servitePlugin: any = config.plugins.find(
              p => p.name === 'servite'
            );

            if (!servitePlugin) {
              throw new Error('The servite plugin is not found');
            }

            // save servite config
            serviteConfig = servitePlugin.api.getServiteConfig();

            // save some config for generate bootstrap code and ssg
            ({ root } = config);
            ({ outDir } = config.build);

            // redirect ssr outDir to {outDir}/server
            config.build.outDir = ssr
              ? path.join(outDir ? outDir + '/' : '', 'server')
              : outDir;
          },
        },
      ],
      build: {
        ...inlineConfig.build,
        ssr: ssr ? SSR_ENTRY_FILE : false,
        ssrManifest: !ssr,
      },
    };
  };

  const clientResult = (await viteBuild(
    resolveInlineConfig(false)
  )) as RollupOutput;

  if (serviteConfig.ssr) {
    await viteBuild(resolveInlineConfig(true));
    await generateBootstrap(outDir);

    await ssg(root, outDir);
  }

  return {
    clientResult,
    outDir,
  };
}
