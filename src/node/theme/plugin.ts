import path from 'upath';
import fs from 'fs-extra';
import { Plugin } from 'vite';
import { RESOLVED_THEME_MODULE_ID, THEME_MODULE_ID } from '../constants.js';
import { ServiteConfig } from '../types.js';

export interface ServiteThemePluginConfig {
  serviteConfig: ServiteConfig;
}

export function serviteTheme({
  serviteConfig,
}: ServiteThemePluginConfig): Plugin {
  return {
    name: 'servite:theme',
    config(config) {
      const root = path.resolve(config.root || '');
      let { theme } = serviteConfig;

      if (!theme && checkSrcThemeExist(root)) {
        theme = 'src/theme';
      }

      if (theme) {
        return {
          resolve: {
            alias: {
              [THEME_MODULE_ID]: path.resolve(root, theme),
            },
          },
        };
      }
    },
    resolveId(source) {
      if (source === THEME_MODULE_ID) {
        return RESOLVED_THEME_MODULE_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_THEME_MODULE_ID) {
        return '// Fallback\nexport default undefined;\n';
      }
    },
  };
}

function checkSrcThemeExist(root: string) {
  return ['.js', '.jsx', '.ts', '.tsx'].some(ext =>
    fs.existsSync(path.resolve(root, 'src/theme', `index${ext}`))
  );
}
