import path from 'upath';
import { Plugin, ResolvedConfig } from 'vite';
import { THEME_MODULE_ID } from '../constants.js';
import { ServiteConfig } from '../types.js';

export interface ServiteThemePluginConfig {
  serviteConfig: ServiteConfig;
}

export function serviteTheme({
  serviteConfig,
}: ServiteThemePluginConfig): Plugin {
  let viteConfig: ResolvedConfig;

  return {
    name: 'servite:theme',
    configResolved(config) {
      viteConfig = config;
    },
    resolveId(source) {
      if (source === THEME_MODULE_ID) {
        // TODO: resolve theme path
        return path.resolve(viteConfig.root, serviteConfig.theme);
      }
    },
  };
}
