/**
 * Based on @docusaurus/theme-search-algolia
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Helmet, useNavigate, isBrowser } from 'servite/client';
import { useDocSearchKeyboardEvents } from '@docsearch/react';
import { ALGOLIA_CONFIG, IN_BROWSER, LOCALES } from '@/constants';
import { useSiteState } from '@/context';
import { removeTailSlash } from '@/utils';
import { Search as IconSearch, Command as IconCommand } from '../Icons';

let DocSearchModal: React.ComponentType<any> | null = null;

async function ensureDocSearchModal() {
  if (DocSearchModal) {
    return;
  }

  [{ DocSearchModal }] = await Promise.all([
    // @ts-ignore
    import('@docsearch/react/modal'),
    // @ts-ignore
    import('@docsearch/react/style'),
  ]);
}

function Hit({ hit, children }: { hit: any; children?: React.ReactNode }) {
  return <Link to={hit.url}>{children}</Link>;
}

export function Search({ iconOnly }: { iconOnly?: boolean }) {
  const routerNavigate = useNavigate();
  const { currentLocale } = useSiteState();
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(async () => {
    await ensureDocSearchModal();
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const transformItems = useCallback((items: any[]) => {
    return items.map(item => {
      const { pathname, hash } = new URL(item.url);
      return {
        ...item,
        url: `${removeTailSlash(import.meta.env.BASE_URL)}${pathname}${hash}`,
      };
    });
  }, []);

  const navigator = useRef({
    navigate({ item }: any) {
      if (item?.url) {
        routerNavigate(item.url);
      }
    },
  }).current;

  // if has multiple locales,
  // the search results should be filtered based on the language
  const facetFilters = useMemo(() => {
    let userFacetFilters = ALGOLIA_CONFIG?.searchParameters?.facetFilters || [];
    userFacetFilters =
      typeof userFacetFilters === 'string'
        ? [userFacetFilters]
        : userFacetFilters;

    return LOCALES.length > 1
      ? [`lang:${currentLocale.locale}`, ...userFacetFilters]
      : userFacetFilters;
  }, [currentLocale]);

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
  });

  if (!ALGOLIA_CONFIG?.apiKey || !ALGOLIA_CONFIG?.indexName) {
    return null;
  }

  return (
    <>
      {!isBrowser && (
        <Helmet>
          {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
          <link
            rel="preconnect"
            href={`https://${
              ALGOLIA_CONFIG.appId || 'BH4D9OD16A'
            }-dsn.algolia.net`}
            crossOrigin=""
          />
        </Helmet>
      )}

      <button
        ref={searchButtonRef}
        className="group flex justify-center items-center h-full ml-6"
        aria-label="Search"
        onMouseOver={ensureDocSearchModal}
        onTouchStart={ensureDocSearchModal}
        onFocus={ensureDocSearchModal}
        onClick={onOpen}
      >
        {iconOnly ? (
          <div className="flex justify-center w-12">
            <IconSearch className="text-xl text-c-text-0 group-hover:text-c-brand transition-colors" />
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-1.5 mr-1.5 text-c-text-2 group-hover:text-c-text-0 transition-colors">
              <IconSearch className="text-[15px]" />
              <span className="text-[13px]">Search</span>
            </div>
            <div className="flex items-center h-4.5 px-0.5 border border-current rounded text-xs text-c-text-3 group-hover:text-c-brand transition-colors">
              <IconCommand />K
            </div>
          </>
        )}
      </button>

      {IN_BROWSER &&
        isOpen &&
        DocSearchModal &&
        createPortal(
          <DocSearchModal
            initialScrollY={window.scrollY}
            transformItems={transformItems}
            hitComponent={Hit}
            navigator={navigator}
            onClose={onClose}
            {...ALGOLIA_CONFIG}
            searchParameters={{
              ...ALGOLIA_CONFIG.searchParameters,
              facetFilters,
            }}
          />,
          document.body
        )}
    </>
  );
}
