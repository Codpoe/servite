import path from 'upath';
import { Plugin, ResolvedConfig } from 'vite';
import { RESOLVED_THEME_MODULE_ID, THEME_MODULE_ID } from '../constants.js';
import { ServiteConfig } from '../types.js';

export interface ServiteThemePluginConfig {
  serviteConfig: ServiteConfig;
}

export function serviteTheme({
  serviteConfig,
}: ServiteThemePluginConfig): Plugin {
  const { theme } = serviteConfig;
  let viteConfig: ResolvedConfig;

  return {
    name: 'servite:theme',
    configResolved(config) {
      viteConfig = config;
    },
    resolveId(source) {
      if (source === THEME_MODULE_ID) {
        if (theme) {
          return path.resolve(viteConfig.root, theme);
        }
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
