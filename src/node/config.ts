import { ServiteConfig, UserServiteConfig } from './types.js';

export function resolveServiteConfig(
  userServiteConfig: UserServiteConfig = {}
): ServiteConfig {
  const {
    pagesDir = [{ dir: 'src/pages' }],
    ssr = true,
    ssg = false,
    hashRouter = false,
  } = userServiteConfig;

  return {
    pagesDir,
    ssr,
    ssg,
    hashRouter,
    nitro: {},
  };
}
