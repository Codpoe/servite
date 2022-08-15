import { UserServiteConfig, ServiteConfig } from './types.js';

export function resolveServiteConfig(
  userServiteConfig: UserServiteConfig = {}
): ServiteConfig {
  const { ssr = true, ssg = true, hashRouter = false } = userServiteConfig;

  return {
    ssr,
    ssg,
    hashRouter,
  };
}
