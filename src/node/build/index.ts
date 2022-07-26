import { build as viteBuild, InlineConfig, ResolvedConfig } from 'vite';
import { RollupOutput } from 'rollup';
import { SSR_ENTRY_FILE } from '../constants';

export async function build(inlineConfig: InlineConfig) {
  let viteConfig: ResolvedConfig;

  const resolveInlineConfig = (ssr: boolean): InlineConfig => {
    return {
      ...inlineConfig,
      plugins: [
        ...(inlineConfig.plugins || []),
        {
          name: 'servite:build',
          enforce: 'post',
          configResolved(config) {
            viteConfig = config;

            // mutate outDir
            const { outDir } = config.build;
            config.build.outDir = outDir + ssr ? '/server' : '/client';
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

  const [clientResult] = (await Promise.all([
    viteBuild(resolveInlineConfig(false)),
    viteBuild(resolveInlineConfig(true)),
  ])) as [RollupOutput, RollupOutput];

  return {
    clientResult,
    // @ts-ignore
    outDir: viteConfig.build.outDir,
  };
}
