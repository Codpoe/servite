import { createContext, useContext } from 'react';
import { type RouteHandle, ssrData } from 'servite/client';
import { NavItem, SiteContextValue } from './types';
import { LOCALES, LOCALE_TO_NAV, LOCALE_TO_SIDEBAR } from './constants';

export function createSiteContextValue(
  pathname: string | undefined,
  routeHandle: RouteHandle | undefined
): SiteContextValue {
  const currentLocale =
    LOCALES.find(x => pathname?.startsWith(x.localePath)) ||
    LOCALES[LOCALES.length - 1];

  const textNav: NavItem[] = [];
  const iconNav: NavItem[] = [];

  (LOCALE_TO_NAV[currentLocale.locale] || []).forEach(x => {
    if (x.text) {
      textNav.push(x);
    } else {
      iconNav.push(x);
    }
  });

  const sidebar = LOCALE_TO_SIDEBAR[currentLocale.locale] || [];

  return {
    currentLocale,
    textNav,
    iconNav,
    sidebar,
    routeHandle,
    frontmatter: routeHandle?.module.frontmatter,
  };
}

const routeHandles = ssrData?.routerContext?.handles || [];

const siteContext = createContext<SiteContextValue>(
  createSiteContextValue(
    ssrData?.context.pathname,
    routeHandles[routeHandles.length - 1]
  )
);

export const SiteContextProvider = siteContext.Provider;

export const useSite = () => useContext(siteContext);
