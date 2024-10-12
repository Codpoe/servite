import { forwardRef, lazy, useEffect, useLayoutEffect, useRef } from 'react';
import { DataRouteObject, Outlet, useRouteError } from 'react-router-dom';
import fileRoutes from 'vinxi/routes';
import { getManifest } from 'vinxi/manifest';
import { Manifest } from 'vinxi/dist/types/types/manifest';
import { cleanupStyles, preloadStyles, updateStyles } from 'vinxi/css';
import { renderAsset } from '@vinxi/react';
import { FsRouteMod, PageFsRouteModule, RouterName } from '../types/index.js';

const isBrowser = typeof document !== 'undefined';

const dirname = (path: string) => path.replace(/\/[^/]+$/, '') || '/';

const lazyMod = (
  routeMod: FsRouteMod,
  clientManifest: Manifest,
  ssrManifest: Manifest,
) => {
  if (import.meta.env.DEV) {
    const manifest = import.meta.env.SSR ? ssrManifest : clientManifest;
    return manifest.inputs[routeMod.src].import();
  }
  return routeMod.import();
};

type EnhancedComponent = React.ComponentType<any> & {
  /**
   * Preload the route component required for the current page
   */
  preload: () => Promise<React.ComponentType<any>>;
  /**
   * Prefetch route component that may be needed in the future or next page
   */
  prefetch: () => Promise<{ mod: any; assets: any[] }>;
};

const lazyRoute = (
  routeMod: FsRouteMod,
  clientManifest: Manifest,
  ssrManifest: Manifest,
  exported: 'default' | 'ErrorBoundary',
): EnhancedComponent => {
  let fetchAssetsPromise: Promise<any[]>;

  const fetchAssets = async () => {
    return (fetchAssetsPromise ||=
      clientManifest.inputs?.[routeMod.src].assets());
  };

  const fetchModAndAssets = async () => {
    const [mod, assets] = await Promise.all([
      lazyMod(routeMod, clientManifest, ssrManifest),
      fetchAssets(),
    ]);
    return { mod, assets };
  };

  const factory = async () => {
    const { mod, assets } = await fetchModAndAssets();
    const Component = mod[exported];
    let devStyles: any[] | undefined;

    if (import.meta.env.DEV) {
      if (import.meta.hot && isBrowser) {
        devStyles = assets.filter(asset => asset?.tag === 'style');
        import.meta.hot.on('css-update', data => {
          updateStyles(devStyles!, data);
        });
      }
    } else if (isBrowser) {
      const styles = assets.filter(asset => asset?.attrs.rel === 'stylesheet');
      preloadStyles(styles);
    }

    // eslint-disable-next-line react/display-name
    const Wrapped = forwardRef((props, ref) => {
      if (isBrowser && devStyles) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLayoutEffect(() => {
          return () => {
            // remove style tags added by vite when a CSS file is imported
            cleanupStyles(devStyles);
          };
        }, []);
      }

      return (
        <>
          {assets.map(asset => renderAsset(asset))}
          <Component {...props} ref={ref} />
        </>
      );
    });

    return { default: Wrapped };
  };

  const Lazy = lazy(factory);
  let Preloaded: React.ComponentType<any>;
  let preloadPromise: Promise<React.ComponentType<any>>;

  const Component = forwardRef(function LazyWithPreload(props, ref) {
    const componentRef = useRef(Preloaded ?? Lazy);
    return <componentRef.current {...props} ref={ref} />;
  });

  const Enhanced: EnhancedComponent = Component as any;

  Enhanced.preload = () => {
    return (preloadPromise ||= factory().then(mod => {
      Preloaded = mod.default;
      return Preloaded;
    }));
  };

  Enhanced.prefetch = () => {
    return fetchModAndAssets();
  };

  return Enhanced;
};

const RootErrorBoundary = () => {
  const error: any = useRouteError();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <>
      <style>{`
    .servite-error-boundary {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .servite-error-title {
      margin: 0;
      font-size: 56px;
      line-height: 64px;
      font-weight: 600;
      color: #374151;
    }
    
    .servite-error-desc {
      margin: 0;
      padding-top: 28px;
      letter-spacing: 1px;
      font-size: 20px;
      line-height: 20px;
      font-weight: 700;
      color: #374151;
    }
    
    .servite-error-divider {
      margin: 24px auto 18px;
      width: 64px;
      height: 1px;
      background-color: #d1d5db;
    }
    
    .servite-error-msg {
      margin: 0 auto;
      max-width: 600px;
      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
      color: #6b7280;
    }
    
    @media (prefers-color-scheme: dark) {
      .servite-error-boundary {
        background: #1b1b1f;
      }
    
      .servite-error-title {
        color: #e5e7eb;
      }
    
      .servite-error-desc {
        color: #e5e7eb;
      }
    
      .servite-error-divider {
        background-color: #6b7280;
      }
    
      .servite-error-msg {
        color: #9ca3af;
      }
    }

    html.dark {
      .servite-error-boundary {
        background: #1b1b1f;
      }
    
      .servite-error-title {
        color: #e5e7eb;
      }
    
      .servite-error-desc {
        color: #e5e7eb;
      }
    
      .servite-error-divider {
        background-color: #6b7280;
      }
    
      .servite-error-msg {
        color: #9ca3af;
      }
    }
          `}</style>
      <div className="servite-error-boundary">
        <h1 className="servite-error-title">{error?.status || 'Oops!'}</h1>
        <p className="servite-error-desc">
          {error?.statusText || 'An unexpected error has occurred.'}
        </p>
        <div className="servite-error-divider"></div>
        <p className="servite-error-msg">
          {error?.data || error?.toString?.()}
        </p>
      </div>
    </>
  );
};

const rootRoot: DataRouteObject = {
  id: '__servite_root__',
  element: <Outlet />,
  errorElement: <RootErrorBoundary />,
};

export const HANDLE_INIT_KEY = '__servite_handle_init__';

let _routes: DataRouteObject[];

export function getRoutes(): DataRouteObject[] {
  if (_routes) {
    return _routes;
  }

  const routes = [];
  const clientManifest = getManifest(RouterName.Client);
  const ssrManifest = getManifest(RouterName.SSR);
  const layoutStack: DataRouteObject[] = [];

  for (const fsRoute of fileRoutes as PageFsRouteModule[]) {
    const Component = lazyRoute(
      fsRoute.$component,
      clientManifest,
      ssrManifest,
      'default',
    );

    const route: DataRouteObject = {
      id: fsRoute.$component.src || fsRoute.filePath,
      path: fsRoute.isLayout ? undefined : fsRoute.routePath,
      loader: fsRoute.hasLoader
        ? async (...args: any[]) => {
            const mod = await lazyMod(
              fsRoute.$data!,
              clientManifest,
              ssrManifest,
            );
            return mod.loader?.(...args);
          }
        : undefined,
      action: fsRoute.hasAction
        ? async (...args: any[]) => {
            const mod = await lazyMod(
              fsRoute.$data!,
              clientManifest,
              ssrManifest,
            );
            return mod.action?.(...args);
          }
        : undefined,
      Component,
      ErrorBoundary: fsRoute.hasErrorBoundary
        ? lazyRoute(
            fsRoute.$component,
            clientManifest,
            ssrManifest,
            'ErrorBoundary',
          )
        : undefined,
      handle: {
        ...fsRoute.handle,
        ...fsRoute.$$handle?.require()?.handle,
        async [HANDLE_INIT_KEY]() {
          const { mod } = await Component.prefetch();

          if (this?.[HANDLE_INIT_KEY]) {
            Object.assign(this, {
              ...mod,
              default: undefined,
              ErrorBoundary: undefined,
              handle: undefined,
            });
          }
        },
      },
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

  // wrap routes with root route to add default error boundary
  return (_routes = [
    {
      ...rootRoot,
      children: routes,
    },
  ] as DataRouteObject[]);
}
