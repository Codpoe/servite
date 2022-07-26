import path from 'upath';
import fs from 'fs-extra';
import { DEFAULT_PAGES_DIR, DEFAULT_SERVER_ENTRY } from './constants.js';
import { UserServiteConfig, ServiteConfig } from './types.js';

export function resolveServerEntry(root: string, userServerEntry?: string) {
  if (userServerEntry) {
    return path.join(
      '/',
      path.relative(root, path.resolve(root, userServerEntry))
    );
  }

  for (const entry of DEFAULT_SERVER_ENTRY) {
    if (fs.existsSync(path.resolve(root, entry))) {
      return path.join('/', entry);
    }
  }
}

export function resolveServiteConfig(
  userServiteConfig: UserServiteConfig = {}
): ServiteConfig {
  const {
    pagesDir = DEFAULT_PAGES_DIR,
    ssr = true,
    ssg = true,
    hashRouter = false,
  } = userServiteConfig;

  return {
    pagesDir,
    ssr,
    ssg,
    hashRouter,
  };
}
