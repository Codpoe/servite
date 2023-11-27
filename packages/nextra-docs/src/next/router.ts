/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  useHref as _useHref,
  useLocation as _useLocation,
  useMatch as _useMatch,
  useNavigate as _useNavigate,
  useLinkClickHandler as _useLinkClickHandler,
  MemoryRouter,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
  createRoutesFromChildren,
  generatePath,
  matchRoutes,
  matchPath,
  createPath,
  parsePath,
  resolvePath,
  renderMatches,
  useInRouterContext,
  useNavigationType,
  useOutlet,
  useParams,
  useResolvedPath,
  useRoutes,
  useOutletContext,
  NavigationType,
  To,
  NavigateFunction,
  BrowserRouter,
  HashRouter,
  useSearchParams,
  createSearchParams,
} from 'react-router-dom';
import { resolveURL, withoutBase } from 'ufo';
// import { hasIslands, isBrowser } from 'servite/client';

const hasIslands = false;
const isBrowser = false;

export {
  MemoryRouter,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
  createRoutesFromChildren,
  generatePath,
  matchRoutes,
  matchPath,
  createPath,
  parsePath,
  resolvePath,
  renderMatches,
  useInRouterContext,
  useNavigationType,
  useOutlet,
  useParams,
  useResolvedPath,
  useRoutes,
  useOutletContext,
  useSearchParams,
  NavigationType,
  createSearchParams,
  BrowserRouter,
  HashRouter,
};

export type {
  Hash,
  Location,
  Path,
  To,
  MemoryRouterProps,
  NavigateFunction,
  NavigateOptions,
  NavigateProps,
  Navigator,
  OutletProps,
  Params,
  PathMatch,
  RouteMatch,
  RouteObject,
  RouteProps,
  PathRouteProps,
  LayoutRouteProps,
  IndexRouteProps,
  RouterProps,
  Pathname,
  Search,
  RoutesProps,
  BrowserRouterProps,
  HashRouterProps,
  ParamKeyValuePair,
  URLSearchParamsInit,
} from 'react-router-dom';

const basename = import.meta.env.BASE_URL;

function warn(api: string, extraMsg?: string) {
  if (!import.meta.env.PROD && isBrowser) {
    const msg = `[servite] using ${api}() in islands may have unexpected results.${
      extraMsg ? ` ${extraMsg}` : ''
    }`;
    // eslint-disable-next-line no-console
    console.warn(msg);

    try {
      throw new Error(
        '[servite] This error is thrown so that you can more easily find the source of the above warning'
      );
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

/**
 * Returns the full href for the given "to" value.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usehref
 */
export const useHref: typeof _useHref = to => {
  if (hasIslands) {
    // warn('useHref');
    return useMemo(() => {
      const { pathname, search, hash } = resolvePath(
        to,
        window.location.pathname
      );
      return resolveURL(basename, pathname, search, hash);
    }, [to]);
  }

  return _useHref(to);
};

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * @see https://reactrouter.com/docs/en/v6/api#uselocation
 */
export const useLocation: typeof _useLocation = () => {
  if (hasIslands) {
    // warn('useLocation', 'It will always return `window.location`');
    return useMemo(
      () => ({
        ...window.location,
        pathname: withoutBase(window.location.pathname, basename),
        state: null,
        key: '',
      }),
      []
    );
  }
  return _useLocation();
};

/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usematch
 */
export const useMatch: typeof _useMatch = pattern => {
  if (hasIslands) {
    // warn('useMatch', 'It will run matchPath() with `window.location.pathname`');
    return useMemo(
      () => matchPath(pattern, withoutBase(window.location.pathname, basename)),
      [pattern]
    );
  }
  return _useMatch(pattern);
};

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigate
 */
export const useNavigate: typeof _useNavigate = () => {
  const activeRef = useRef(false);

  useEffect(() => {
    activeRef.current = true;
  });

  if (hasIslands) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
      ((to, options) => {
        if (!activeRef.current) {
          return;
        }

        if (typeof to === 'number') {
          window.history.go(to);
          return;
        }

        const { pathname, search, hash } = resolvePath(
          to,
          withoutBase(window.location.pathname, basename)
        );

        (options?.replace
          ? window.history.replaceState
          : window.history.pushState)(
          options?.state,
          '',
          resolveURL(basename, pathname, search, hash)
        );
      }) as NavigateFunction,
      []
    );
  }

  return _useNavigate();
};

export const useLinkClickHandler: typeof _useLinkClickHandler = (
  to,
  options
) => {
  if (hasIslands) {
    const { target, replace, state } = options || {};
    const navigate = useNavigate();

    return useCallback(
      event => {
        if (
          event.button === 0 && // Ignore everything but left clicks
          (!target || target === '_self') && // Let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // Ignore clicks with modifier keys
        ) {
          event.preventDefault(); // If the URL hasn't changed, a regular <a> will do a replace instead of
          // a push, so do the same here.

          navigate(to, {
            replace,
            state,
          });
        }
      },
      [navigate, target, replace, state, to]
    );
  }

  return _useLinkClickHandler(to, options);
};

function isModifiedEvent(event: any) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export const basePath = (import.meta.env.BASE_URL || '/').replace(
  /(.+)\/$/,
  '$1'
);

/**
 * @see https://nextjs.org/docs/api-reference/next/router#router-object
 */
export function useRouter() {
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const push = useCallback(
    (to: To) => {
      return navigate(to);
    },
    [navigate]
  );

  const replace = useCallback(
    (to: To) => {
      return navigate(to, { replace: true });
    },
    [navigate]
  );

  return useMemo(() => {
    const query = [...searchParams.keys()].reduce<
      Record<string, string | string[]>
    >((res, key) => {
      const values = searchParams.getAll(key);
      const length = values.length;

      if (length === 1) {
        res[key] = values[0];
      } else if (length > 1) {
        res[key] = values;
      }

      return res;
    }, {});

    return {
      // properties
      pathname,
      query,
      asPath: pathname + search,
      isFallback: false,
      basePath,
      // FIXME
      locale: 'en-US',
      locales: ['en-US'],
      defaultLocale: 'en-US',
      domainLocales: [],
      isReady: true,
      isPreview: false,
      // methods
      push,
      replace,
    };
  }, [pathname, search, searchParams, push, replace]);
}
