// The code in this file will be injected into virtual:servite/pages-routes for HMR
import { Route } from '../shared/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function lazyFactory(moduleOrFunction: any) {
  return async function lazy(this: Partial<Route>) {
    const module =
      typeof moduleOrFunction === 'function'
        ? await moduleOrFunction()
        : moduleOrFunction;
    const filePath = this?.filePath;
    const dataFilePath = this?.dataFilePath;

    return {
      Component: module.default,
      ErrorBoundary: module.ErrorBoundary,
      handle: {
        filePath,
        dataFilePath,
        module,
      },
    };
  };
}
