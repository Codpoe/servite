import './layout.css';

import { useMemo } from 'react';
import {
  Helmet,
  Outlet,
  useLocation,
  useMatches,
  type RouteHandle,
} from 'servite/client';
import { SiteContextProvider, createSiteContextValue } from '@/context';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants';
import { Header } from '@/components/Header';
import { DocLayout } from '@/components/DocLayout';
import { HomeLayout } from '@/components/HomeLayout';
import type { SiteContextValue } from '@/types';

export default function Layout() {
  const { pathname } = useLocation();
  const routeMatches = useMatches();

  const siteContextValue: SiteContextValue = useMemo(() => {
    return createSiteContextValue(
      pathname,
      routeMatches[routeMatches.length - 1]?.handle as RouteHandle
    );
  }, [pathname, routeMatches]);

  const { currentLocale, routeHandle } = siteContextValue;

  return (
    <>
      <Helmet titleTemplate={`%s | ${SITE_TITLE}`} defaultTitle={SITE_TITLE}>
        <html lang={currentLocale.locale} />
        <title>{routeHandle?.meta?.title}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
      </Helmet>
      <SiteContextProvider value={siteContextValue}>
        <Header />
        {routeHandle?.meta?.layout === 'home' ? (
          <HomeLayout />
        ) : /\.mdx?$/.test(routeHandle?.filePath || '') ? (
          <DocLayout />
        ) : (
          <Outlet />
        )}
      </SiteContextProvider>
    </>
  );
}
