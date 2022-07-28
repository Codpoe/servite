import path from 'upath';
import { ServerEntryExports } from '../types.js';

export async function ssg(root: string, outDir: string) {
  const outDirAbsPath = path.resolve(root, outDir);
  const serverEntry = path.resolve(outDirAbsPath, 'server/entry.server.js');

  const { render, entries, pages } = (await import(
    serverEntry
  )) as ServerEntryExports;

  pages.map(async page => {
    // TODO: determine if ssg is needed
    if (/\/:\w/.test(page.routePath)) {
      return;
    }
  });
}
