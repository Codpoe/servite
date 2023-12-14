import assert from 'assert';
import type { ServiteConfig, UserServiteConfig } from './types.js';

export function resolveServiteConfig(
  userServiteConfig: UserServiteConfig = {}
): ServiteConfig {
  const {
    pagesDirs = [{ dir: 'src/pages' }],
    ssg = false,
    csr = false,
    islands = false,
    ...rest
  } = userServiteConfig;

  assert(pagesDirs.length, 'pagesDirs is empty');

  return {
    ...rest,
    pagesDirs,
    ssg,
    csr,
    islands,
  };
}
