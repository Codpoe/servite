// The code in this file will be injected into virtual:servite/pages-routes for HMR

// data is defined in pages-routes module
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let data: any;

if (import.meta.hot) {
  const debounce = (fn: any, delay: number) => {
    let handle: any;
    return (...args: any[]) => {
      clearTimeout(handle);
      handle = setTimeout(() => fn(...args), delay);
    };
  };

  import.meta.hot.accept(
    '/@servite/pages-data',
    debounce(async (mod: any) => {
      if (!mod) {
        return;
      }

      data = mod.data;

      if (window.__SERVITE_dataFileUpdates__?.size) {
        await window.__SERVITE_mapRoutes__(route => {
          const dataFilePath = (route.handle || route).dataFilePath;
          // react-refresh takes care of updating these in-place,
          // if we don't preserve existing values we'll loose state.
          if (window.__SERVITE_dataFileUpdates__?.has(dataFilePath)) {
            window.__SERVITE_dataFileUpdates__.delete(dataFilePath);

            return {
              ...route,
              shouldRevalidate: (() => {
                let revalidated = false;

                return function shouldRevalidate(args) {
                  if (!revalidated) {
                    revalidated = true;
                    return true;
                  }
                  return (
                    route.shouldRevalidate?.(args) ??
                    args.defaultShouldRevalidate
                  );
                };
              })(),
            };
          }

          return route;
        });

        window.__SERVITE_routesUpdateResolve__?.();
      }
    }, 16)
  );
}
