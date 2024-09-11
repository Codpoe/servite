import { DataRouteObject } from 'react-router-dom';
import fileRoutes from 'vinxi/routes';
import { lazyRoute } from '@vinxi/react';
import { getManifest } from 'vinxi/manifest';
import { Manifest } from 'vinxi/dist/types/types/manifest';
import { FsRouteMod, PageFsRouteModule, RouterName } from '../types/index.js';

const dirname = (path: string) => path.replace(/\/[^/]+$/, '') || '/';

const lazyLoaderAction =
  (
    routeMod: FsRouteMod,
    clientManifest: Manifest,
    ssrManifest: Manifest,
    exported: 'loader' | 'action',
  ) =>
  (...args: any[]) => {
    if (import.meta.env.DEV) {
      const manifest = import.meta.env.SSR ? ssrManifest : clientManifest;
      return manifest.inputs[routeMod.src]
        .import()
        .then(mod => mod[exported]?.(...args));
    }
    return routeMod.import().then(mod => mod[exported]?.(...args));
  };

const getRoutes = () => {
  const clientManifest = getManifest(RouterName.Client);
  const ssrManifest = getManifest(RouterName.SSR);
  const routes: DataRouteObject[] = [];
  const layoutStack: DataRouteObject[] = [];

  for (const fsRoute of fileRoutes as PageFsRouteModule[]) {
    const route: DataRouteObject = {
      id: fsRoute.filePath,
      path: fsRoute.routePath,
      loader: fsRoute.hasLoader
        ? lazyLoaderAction(
            fsRoute.$data!,
            clientManifest,
            ssrManifest,
            'loader',
          )
        : undefined,
      action: fsRoute.hasAction
        ? lazyLoaderAction(
            fsRoute.$data!,
            clientManifest,
            ssrManifest,
            'action',
          )
        : undefined,
      Component: lazyRoute(
        fsRoute.$component,
        clientManifest,
        ssrManifest,
        'default',
      ),
      ErrorBoundary: fsRoute.hasErrorBoundary
        ? lazyRoute(
            fsRoute.$component,
            clientManifest,
            ssrManifest,
            'ErrorBoundary',
          )
        : undefined,
      children: fsRoute.isLayout ? [] : undefined,
    };

    const routeDir = dirname(route.id);

    while (layoutStack.length) {
      const layout = layoutStack[layoutStack.length - 1];
      const layoutDir = dirname(layout.id);

      // - root layout
      // - layout and page are in the same directory
      // - layout is a parent directory of page
      if (
        layoutDir === '/' ||
        layoutDir === routeDir ||
        routeDir.startsWith(layoutDir + '/')
      ) {
        layout.children?.push(route);
        break;
      }

      layoutStack.pop();
    }

    if (!layoutStack.length) {
      routes.push(route);
    }

    if (fsRoute.isLayout) {
      layoutStack.push(route);
    }
  }

  return routes;
};

export const routes = getRoutes();
