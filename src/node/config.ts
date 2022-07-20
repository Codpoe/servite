import path from 'upath';
import fs from 'fs-extra';
import { DEFAULT_SERVER_ENTRY } from './constants';
import { ServiteConfig, ResolvedServiteConfig } from './types';

function resolveServerEntry(root: string, userServerEntry?: string) {
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
  root: string,
  config: ServiteConfig
): ResolvedServiteConfig {
  return {
    serverEntry: resolveServerEntry(root, config.serverEntry),
  };
}
