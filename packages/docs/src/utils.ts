import { matchPath, isBrowser } from 'servite/client';
import { IN_BROWSER, THEME_MODE_STORAGE_KEY } from './constants';
import { LocaleConfig, ThemeConfig, ThemeMode } from './types';

export function getThemeMode(): ThemeMode {
  if (!isBrowser) {
    return 'light';
  }

  let themeMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);

  if (!themeMode && window.matchMedia) {
    themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return (themeMode || 'light') as ThemeMode;
}

/**
 * merge theme config by path
 */
export function mergeThemeConfig(
  config: ThemeConfig,
  pagePath: string | undefined
): ThemeConfig {
  const foundPath =
    pagePath &&
    Object.keys(config.themeConfigByPaths || {})
      .sort((a, b) => b.length - a.length)
      .find(path => {
        const _path = path.includes(':') ? path : removeTailSlash(path) + '/*';
        return matchPath(_path, pagePath);
      });

  return {
    ...config,
    ...(foundPath && config.themeConfigByPaths?.[foundPath]),
  };
}

/**
 * get locales config from theme config
 */
export function getLocales(config: ThemeConfig): LocaleConfig[] {
  const res: LocaleConfig[] = [];

  const extractLocale = (localePath: string, _config: ThemeConfig = {}) => {
    const { locale, localeText = locale } = _config;

    if (locale && localeText && !res.some(item => item.locale === locale)) {
      res.push({
        locale,
        localeText,
        localePath,
      });
    }
  };

  extractLocale('/', config);

  Object.entries(config.themeConfigByPaths || {}).forEach(
    ([path, pathConfig]) => {
      extractLocale(path, pathConfig);
    }
  );

  return res;
}

export function removeTailSlash(path: string) {
  return path.replace(/\/$/, '');
}

/**
 * replace the locale prefix in pathname
 * @example '/zh/a' -> '/en/a'
 */
export function replaceLocaleInPath(
  pathname: string,
  currentLocalePath: string,
  targetLocalePath: string
) {
  currentLocalePath = removeTailSlash(currentLocalePath);
  targetLocalePath = removeTailSlash(targetLocalePath);

  if (!currentLocalePath) {
    return `${targetLocalePath}${pathname}`;
  }

  return (
    pathname.replace(new RegExp(`^${currentLocalePath}`), targetLocalePath) ||
    '/'
  );
}

export async function copyToClipboard(text: string) {
  if (IN_BROWSER && 'clipboard' in window.navigator) {
    return window.navigator.clipboard.writeText(text);
  }
}
