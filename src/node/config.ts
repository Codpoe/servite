import path from 'upath';
import fs from 'fs-extra';
import { DEFAULT_SERVER_ENTRY } from './constants.js';

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
