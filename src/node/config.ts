import { ServiteConfig, UserServiteConfig } from './types.js';

export function resolveServiteConfig(
  userServiteConfig: UserServiteConfig = {}
): ServiteConfig {
  const {
    pagesDirs = [{ dir: 'src/pages' }],
    ssr = true,
    ssg = false,
    hashRouter = false,
    ...rest
  } = userServiteConfig;

  return {
    ...rest,
    pagesDirs,
    ssr,
    ssg,
    hashRouter,
  };
}
