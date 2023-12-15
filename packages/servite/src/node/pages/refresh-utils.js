// This file is Modified from https://github.com/vitejs/vite-plugin-react/blob/8b5354741a173ce02892ff021c8bdfba4c9f0d11/packages/plugin-react/src/refreshUtils.js#L1
// We need to synchronize changes from the official plugin: vite-plugin-react
// The code here will be injected into the browser

function debounce(fn, delay) {
  let handle;
  return () => {
    clearTimeout(handle);
    handle = setTimeout(fn, delay);
  };
}

const exportsToFileMap = new WeakMap();
const pageModuleUpdates = new Map();

/* eslint-disable no-undef */
const enqueueUpdate = debounce(async () => {
  await window.__SERVITE_routesUpdatePromise__;

  if (pageModuleUpdates.size) {
    const absFilePaths = [...pageModuleUpdates.keys()];

    await window.__SERVITE_mapRoutes__(route => {
      const filePath = (route.handle || route).filePath;
      const absFilePath = absFilePaths.find(absFilePath =>
        absFilePath.endsWith(filePath)
      );

      if (absFilePath) {
        const newModule = pageModuleUpdates.get(absFilePath);
        pageModuleUpdates.delete(absFilePath);

        return {
          ...route,
          handle: {
            ...route.handle,
            module: newModule,
          },
          shouldRevalidate: (() => {
            let revalidated = false;

            return function shouldRevalidate(args) {
              if (!revalidated) {
                revalidated = true;
                return false;
              }
              return (
                route.shouldRevalidate?.(args) ?? args.defaultShouldRevalidate
              );
            };
          })(),
        };
      }

      return route;
    });
  }

  exports.performReactRefresh();
}, 16);

// Taken from https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/lib/runtime/RefreshUtils.js#L141
// This allows to resister components not detected by SWC like styled component
function registerExportsForReactRefresh(filename, moduleExports) {
  for (const key in moduleExports) {
    if (key === '__esModule') continue;
    const exportValue = moduleExports[key];
    if (exports.isLikelyComponentType(exportValue)) {
      // 'export' is required to avoid key collision when renamed exports that
      // shadow a local component name: https://github.com/vitejs/vite-plugin-react/issues/116
      // The register function has an identity check to not register twice the same component,
      // so this is safe to not used the same key here.
      exports.register(exportValue, filename + ' export ' + key);
    }
  }

  if (/\.(page|layout)\.[jt]sx?$/.test(filename) || /\.mdx?$/.test(filename)) {
    exportsToFileMap.set(moduleExports, filename);
  }
}

// Set acceptExports to prevent hmr boundary crossing
const acceptExports = [
  // mdx fields
  'frontmatter',
  'toc',
];

function validateRefreshBoundaryAndEnqueueUpdate(prevExports, nextExports) {
  if (
    !predicateOnExport(
      prevExports,
      key => key in nextExports || acceptExports.includes(key)
    )
  ) {
    return 'Could not Fast Refresh (export removed)';
  }
  if (
    !predicateOnExport(
      nextExports,
      key => key in prevExports || acceptExports.includes(key)
    )
  ) {
    return 'Could not Fast Refresh (new export)';
  }

  const filename = exportsToFileMap.get(prevExports);
  exportsToFileMap.delete(prevExports);

  let hasExports = false;
  const allExportsAreComponentsOrUnchanged = predicateOnExport(
    nextExports,
    (key, value) => {
      hasExports = true;
      // Servite can handle Servite-specific exports (e.g. `frontmatter` and `toc`)
      if (acceptExports.includes(key)) {
        if (!filename) {
          return false;
        }
        if (
          JSON.stringify(prevExports[key]) !== JSON.stringify(nextExports[key])
        ) {
          pageModuleUpdates.set(filename, nextExports);
        }
        return true;
      }
      // React Fast Refresh can handle component exports
      if (exports.isLikelyComponentType(value)) return true;
      return prevExports[key] === nextExports[key];
    }
  );
  if (hasExports && allExportsAreComponentsOrUnchanged) {
    enqueueUpdate();
  } else {
    return 'Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports';
  }
}

function predicateOnExport(moduleExports, predicate) {
  for (const key in moduleExports) {
    if (key === '__esModule') continue;
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) return false;
    if (!predicate(key, moduleExports[key])) return false;
  }
  return true;
}

// Hides vite-ignored dynamic import so that Vite can skip analysis if no other
// dynamic import is present (https://github.com/vitejs/vite/pull/12732)
function __hmr_import(module) {
  return import(/* @vite-ignore */ module);
}

window.__SERVITE_dataFileUpdates__ = new Set();

import.meta.hot.on('servite:hmr', ({ dataFilePath }) => {
  window.__SERVITE_dataFileUpdates__.add(dataFilePath);
  window.__SERVITE_routesUpdatePromise__ = new Promise(resolve => {
    window.__SERVITE_routesUpdateResolve__ = resolve;
  });
});

exports.__hmr_import = __hmr_import;
exports.registerExportsForReactRefresh = registerExportsForReactRefresh;
exports.validateRefreshBoundaryAndEnqueueUpdate =
  validateRefreshBoundaryAndEnqueueUpdate;
