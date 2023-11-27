import './layout.css';
import 'nextra-theme-docs/style.css';

import { useMemo } from 'react';
import { useAppState, Outlet, Helmet, PageData } from 'servite/client';
import metaFiles, { MetaFile } from 'virtual:servite-nextra-docs/meta-files';
import NextraThemeDocs from 'nextra-theme-docs';

interface NextraMetaPage {
  kind: 'Meta';
  data: Record<string, any>;
}

interface NextraMdxPage {
  kind: 'MdxPage';
  name: string;
  route: string;
}

interface NextraFolder {
  kind: 'Folder';
  name: string;
  children: NextraPage[];
}

type NextraPage = NextraMetaPage | NextraMdxPage | NextraFolder;

interface NextraHeading {
  depth: number;
  id: string;
  value: string;
}

function isMetaFile(file: MetaFile | PageData): file is MetaFile {
  return /_meta(\.[a-z]{2}-[A-Z]{2})?\.json/.test(file.filePath);
}

function pushNextraPage(
  nextraPageMap: NextraPage[],
  file: MetaFile | PageData
) {
  const segments = file.filePath
    .replace(/^src\/pages\//, '')
    .replace(/\..*$/, '')
    .split('/');

  let folderPages: NextraPage[] = nextraPageMap;
  let lastFolderPages: NextraPage[] | undefined;
  let index = -1;

  while (++index < segments.length) {
    const name = segments[index];

    if (index < segments.length - 1) {
      let folder = folderPages.find(
        x => x.kind === 'Folder' && x.name === name
      ) as NextraFolder | undefined;

      if (!folder) {
        folder = {
          kind: 'Folder',
          name,
          children: [],
        };

        folderPages.push(folder);
      }

      lastFolderPages = folderPages;
      folderPages = folder.children;

      continue;
    }

    if (isMetaFile(file)) {
      folderPages.push({
        kind: 'Meta',
        data: file.data,
      });

      return;
    }

    if (name === 'index' && lastFolderPages) {
      lastFolderPages.push({
        kind: 'MdxPage',
        name: segments[index - 1],
        route: file.routePath,
      });

      return;
    }

    folderPages.push({
      kind: 'MdxPage',
      name,
      route: file.routePath,
    });
  }
}

export default function Layout() {
  const appState = useAppState();
  const { pages, pagePath, pageData, pageModule } = appState;

  const nextraPageMap = useMemo<NextraPage[]>(() => {
    const nextraPageMap: NextraPage[] = [];

    [...metaFiles, ...pages]
      .filter(x => !(x as PageData).isLayout && !(x as PageData).is404)
      .forEach(x => {
        pushNextraPage(nextraPageMap, x);
      });

    return nextraPageMap;
  }, [pages]);

  const nextraHeadings = useMemo(() => {
    return (pageModule?.toc || []).map(
      (x: any): NextraHeading => ({
        depth: x.depth,
        id: x.id,
        value: x.text,
      })
    );
  }, [pageModule]);

  if (!pagePath || !pageData || !pageModule) {
    return null;
  }

  return (
    <>
      {/* FIXME: direction */}
      <Helmet>
        <html dir="ltr"></html>
      </Helmet>
      <NextraThemeDocs
        themeConfig={{}}
        pageOpts={{
          filePath: pageData.filePath,
          route: pageData.routePath,
          frontMatter: pageData.meta || {},
          pageMap: nextraPageMap as any,
          title: pageData.meta?.title || '',
          headings: nextraHeadings,
        }}
        pageProps={{}}
      >
        <Outlet />
      </NextraThemeDocs>
    </>
  );
}
