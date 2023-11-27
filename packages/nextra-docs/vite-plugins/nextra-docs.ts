import fs from 'fs/promises';
import path from 'upath';
import { Plugin, ResolvedConfig } from 'vite';
import type { ServiteConfig } from 'servite';

const META_FILES_MODULE_ID = 'virtual:servite-nextra-docs/meta-files';
const META_FILE_PATTERN = '**/_meta?(.[a-z][a-z]-[A-Z][A-Z]).json';

export function nextraDocs(): Plugin {
  let viteConfig: ResolvedConfig;
  let serviteConfig: ServiteConfig;

  return {
    name: 'nextra-docs',
    enforce: 'pre',
    config(config) {
      const root = config.root ? path.resolve(config.root) : process.cwd();

      return {
        resolve: {
          alias: {
            next: path.resolve(root, 'src/next'),
            'servite/client': path.resolve(
              root,
              '../servite/dist/client/router.js'
            ),
          },
        },
      };
    },
    configResolved(config) {
      viteConfig = config;

      const servitePlugin = viteConfig.plugins.find(x => x.name === 'servite');

      if (!servitePlugin) {
        throw new Error('need use this plugin with servite');
      }

      serviteConfig = (servitePlugin.api as any).getServiteConfig();
    },
    resolveId(source) {
      if (source === META_FILES_MODULE_ID) {
        return '\0' + META_FILES_MODULE_ID;
      }
      // if (source === 'nextra-theme-docs') {
      //   return source;
      // }
      // console.warn('>>sss', source);
      // if (source.startsWith('next/')) {
      //   console.log('>>> source', source);
      //   return source;
      // }
    },
    async load(id) {
      if (id === '\0' + META_FILES_MODULE_ID) {
        const dirsFromRoot = serviteConfig.pagesDirs.map(({ dir }) =>
          path.relative(viteConfig.root, path.resolve(viteConfig.root, dir))
        );
        return `${dirsFromRoot
          .map(
            (dir, index) =>
              `const metaMods_${index} = import.meta.glob('/${dir}/${META_FILE_PATTERN}', { eager: true, import: 'default' });`
          )
          .join('\n')}

export default [${dirsFromRoot
          .map((_, index) => `metaMods_${index}`)
          .join(', ')}].reduce((res, mods) => {
  Object.entries(mods).forEach(([key, data]) => {
    res.push({
      filePath: key.slice(1),
      data,
    });
  });

  return res;
}, []);
`;
      }

      // if (id.startsWith('next/')) {
      //   console.log('>> id', id);
      //   return fs.readFile(
      //     path.resolve(
      //       viteConfig.root,
      //       `src/${id}${!/\..+$/.test(id) ? '.ts' : ''}`
      //     ),
      //     'utf-8'
      //   );
      // }

      // if (id === 'nextra-theme-docs') {
      //   return fs.readFile(
      //     path.resolve(
      //       viteConfig.root,
      //       'node_modules/nextra-theme-docs/dist/index.js'
      //     ),
      //     'utf-8'
      //   );
      // }
    },
  };
}
