import { join } from 'path';
import { defineConfig } from 'servite/config';
import * as pagefind from 'pagefind';

const app = defineConfig({
  server: {
    baseURL: process.env.GH_PAGES ? '/servite' : '/',
    prerender: {
      routes: ['**/*'],
      failOnError: true,
    },
  },
});

app.hooks.hook('app:build:nitro:start', async ({ nitro }) => {
  // eslint-disable-next-line no-console
  console.log('\nRunning pagefind...');

  const wrap = async <T extends { errors: string[] }>(
    promise: Promise<T>,
  ): Promise<T> => {
    const res = await promise;

    if (res.errors?.length) {
      throw new Error(res.errors.join('\n'));
    }

    return res;
  };

  const { index } = await wrap(pagefind.createIndex());

  if (!index) {
    return;
  }

  const { page_count } = await wrap(
    index.addDirectory({
      path: nitro.options.output.publicDir,
    }),
  );

  if (page_count === 0) {
    // eslint-disable-next-line no-console
    console.log(`No pages found`);
  }

  // eslint-disable-next-line no-console
  console.log(`Indexed ${page_count} pages`);

  await wrap(
    index.writeFiles({
      outputPath: join(nitro.options.output.publicDir, 'pagefind'),
    }),
  );

  // eslint-disable-next-line no-console
  console.log('Run pagefind successfully\n');
});

export default app;
