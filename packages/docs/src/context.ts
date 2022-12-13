import { createContext, useContext } from 'react';
import { AppState, ssrData } from 'servite/client';
import { LOCALES, LOCALE_TO_NAV, LOCALE_TO_SIDEBAR } from './constants';
import { NavItem, SiteState } from './types';

export function createSiteState(
  appState?: Pick<AppState, 'pagePath' | 'pageData' | 'loaderData'>
): SiteState {
  const { pagePath } = appState || {};

  const currentLocale =
    LOCALES.find(x => pagePath?.startsWith(x.localePath)) ||
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
  };
}

export const siteContext = createContext<SiteState>(
  createSiteState(ssrData?.appState)
);

export const useSiteState = () => useContext(siteContext);
