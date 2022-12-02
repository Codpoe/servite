import path from 'upath';
import fs from 'fs-extra';
import { Plugin, HtmlTagDescriptor } from 'vite';
import { ServiteConfig } from '../types.js';
import { APP_HTML_FILE, FS_PREFIX_CLIENT_ENTRY } from '../constants.js';

export interface ServiteHtmlPluginConfig {
  serviteConfig?: ServiteConfig;
  isClientBuild?: boolean;
}

export function serviteHtml({
  serviteConfig,
  isClientBuild,
}: ServiteHtmlPluginConfig): Plugin {
  return {
    name: 'servite:html',
    enforce: 'post',
    async config(config) {
      const root = path.resolve(config.root || '');

      const target = path.resolve(root, 'node_modules/.servite/index.html');
      const customHtmlFile = path.resolve(root, 'src/index.html');

      if (fs.existsSync(customHtmlFile)) {
        if (fs.existsSync(target)) {
          await fs.unlink(target);
        }
        await fs.link(customHtmlFile, target);
      } else {
        await fs.copy(APP_HTML_FILE, target);
      }

      if (serviteConfig?.spa || isClientBuild) {
        return {
          build: {
            rollupOptions: {
              input: target,
            },
          },
        };
      }
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        const htmlTags: HtmlTagDescriptor[] = [];

        // inject div#root
        if (!/<div.*?id=('|")root(\1)/.test(html)) {
          htmlTags.push({
            tag: 'div',
            attrs: {
              id: 'root',
            },
            injectTo: 'body',
          });
        }

        // inject client entry
        if (serviteConfig?.spa || isClientBuild) {
          htmlTags.push({
            tag: 'script',
            attrs: {
              type: 'module',
              src: FS_PREFIX_CLIENT_ENTRY,
            },
            injectTo: 'head',
          });
        }

        return htmlTags;
      },
    },
    ...((serviteConfig?.spa || isClientBuild) && {
      async generateBundle(_options, bundle) {
        Object.values(bundle).forEach(chunk => {
          if (
            chunk.type === 'asset' &&
            path.normalize(chunk.fileName) ===
              'node_modules/.servite/index.html'
          ) {
            chunk.fileName = 'index.html';
          }
        });
      },
    }),
  };
}
