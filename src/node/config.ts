import { defu } from 'defu';
import { UserServiteConfig } from './types.js';

export function resolveServiteConfig(
  userServiteConfig: UserServiteConfig = {}
) {
  return defu(userServiteConfig, {
    pagesDir: 'src/pages',
    ssr: true,
    ssg: false,
    hashRouter: false,
  });
}

export type ServiteConfig = ReturnType<typeof resolveServiteConfig>;
