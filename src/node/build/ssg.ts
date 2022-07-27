import path from 'upath';
import { ServerEntryExports } from '../types.js';

export async function ssg(root: string, outDir: string) {
  const outDirAbsPath = path.resolve(root, outDir);
  const serverEntry = path.resolve(outDirAbsPath, 'server/entry.server.js');

  const { render, entries, pagesData } = (await import(
    serverEntry
  )) as ServerEntryExports;

  Object.entries(pagesData).map(async ([pagePath, pageData]) => {
    // TODO: determine if ssg is needed
    if (/\/:\w/.test(pagePath)) {
      return;
    }
  });
}
