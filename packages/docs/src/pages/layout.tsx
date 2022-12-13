import './layout.css';

import { useMemo } from 'react';
import { useAppState, Helmet } from 'servite/client';
import { createSiteState, siteContext } from '@/context';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/constants';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Header } from '@/components/Header';
import { DocLayout } from '@/components/DocLayout';
import { HomeLayout } from '@/components/HomeLayout';

export default function Layout() {
  const appState = useAppState();
  const { pagePath, pageData } = appState;

  const siteState = useMemo(() => createSiteState(appState), [appState]);
  const { currentLocale } = siteState;

  useScrollToTop();

  if (!pagePath || !pageData) {
    return null;
  }

  return (
    <>
      <Helmet titleTemplate={`%s | ${SITE_TITLE}`} defaultTitle={SITE_TITLE}>
        <html lang={currentLocale.locale} />
        <title>{pageData.meta?.title}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
      </Helmet>
      <siteContext.Provider value={siteState}>
        <Header />
        {pageData.routePath === currentLocale.localePath ? (
          <HomeLayout />
        ) : (
          <DocLayout />
        )}
      </siteContext.Provider>
    </>
  );
}
