import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Link,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'servite/runtime/router';
import { Helmet } from 'servite/runtime/helmet';
import { Button, Sidebar } from 'shadcn-react';
import cn from 'classnames';
import {
  ChevronRightIcon,
  GithubIcon,
  MenuIcon,
  MoonStarIcon,
  SunIcon,
} from 'shadcn-react/icons';
import { ClientOnly } from 'servite/runtime/components';
import Toc from 'island:components/Toc';
import Search from 'island:components/Search';
import { Mdx } from '@/components/Mdx';
import { useHandle } from '@/hooks/use-handle';
import { sidebarItems } from '@/config/sidebar';
import { throttle } from '@/utils/throttle';
import { getScrollTop } from '@/utils/scroll';
import { SidebarLink } from '@/components/SidebarLink';
import './layout.css';

const THEME_STORAGE_KEY = 'servite:theme';

const supportedLangs = ['en', 'zh'];

function getLangFromPathname(pathname: string) {
  const lang = pathname.split('/')[1];

  if (!lang) {
    return supportedLangs[0];
  }

  return supportedLangs.includes(lang) ? lang : supportedLangs[0];
}

interface DocLayoutProps {
  fixedSidebarVisible: boolean;
  setFixedSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function DocLayout({
  fixedSidebarVisible,
  setFixedSidebarVisible,
}: DocLayoutProps) {
  const { pathname } = useLocation();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 sm:hidden transition-all',
          fixedSidebarVisible
            ? 'visible opacity-100'
            : 'invisible opacity-0 pointer-events-none',
        )}
        onClick={() => setFixedSidebarVisible(false)}
      />
      <Sidebar
        className={cn(
          'flex-shrink-0 fixed top-0 right-full bottom-0 h-screen bg-background z-40 sm:z-auto sm:sticky sm:-mt-14 sm:pt-20 sm:bg-transparent transition-transform overflow-x-auto',
          fixedSidebarVisible && 'translate-x-full',
        )}
        items={sidebarItems}
        itemWrapper={SidebarLink}
        value={pathname}
        onChange={() => {
          setFixedSidebarVisible(false);
        }}
      />
      <div
        className="px-5 sm:px-7 flex-1 pt-6 pb-14 min-w-0"
        data-pagefind-body
      >
        <Mdx>
          <Outlet />
        </Mdx>
      </div>
    </>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { toc } = useHandle();
  const mdTitle = useMemo(() => toc?.find(x => x.depth === 1)?.text, [toc]);
  const [fixedSidebarVisible, setFixedSidebarVisible] = useState(false);
  const [headerMdTitleVisible, setHeaderMdTitleVisible] = useState(false);

  const [theme, setTheme] = useState(
    () =>
      (typeof document !== 'undefined' &&
        window.localStorage.getItem(THEME_STORAGE_KEY)) ||
      'light',
  );

  const matchedSidebarItems = useMemo(() => {
    for (const item of sidebarItems) {
      if ('children' in item) {
        const found = item.children?.find(child => child.value === pathname);
        if (found) {
          return [item, found];
        }
      } else if (item.value === pathname) {
        return [item];
      }
    }
  }, [pathname]);

  const handleSwitchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (getScrollTop() >= 120) {
        setHeaderMdTitleVisible(true);
      } else {
        setHeaderMdTitleVisible(false);
      }
    }, 100);

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Helmet
        titleTemplate={`%s | Servite`}
        defaultTitle="Servite"
        htmlAttributes={{ lang: getLangFromPathname(pathname) }}
      >
        <title data-pagefind-meta={`title:${mdTitle}`}>{mdTitle}</title>
        <meta name="description" content="A full-stack React framework" />
        <script>{`const __theme = typeof document !== 'undefined' && window.localStorage.getItem('${THEME_STORAGE_KEY}') || 'light';
            if (__theme === 'dark') {
              document.documentElement.classList.add('dark');
            }`}</script>
      </Helmet>
      <ScrollRestoration />
      <div>
        <header className="sticky top-0 left-0 right-0 z-30 bg-background/60 border-b border-border backdrop-blur-sm backdrop-saturate-200">
          <div className="max-w-[1380px] h-14 px-5 sm:px-7 mx-auto flex items-center relative">
            <div className="w-64">
              <Link className="inline-block" to="/zh">
                <h1 className="text-xl font-semibold">Servite</h1>
              </Link>
            </div>
            {mdTitle && (
              <div className="relative h-full flex-1 overflow-hidden">
                <h2
                  className={cn(
                    'hidden sm:flex text-xl font-medium absolute left-0 h-full items-center cursor-pointer transition-all',
                    headerMdTitleVisible
                      ? 'top-0 opacity-100'
                      : 'top-full opacity-0',
                  )}
                  onClick={() => window.scrollTo({ top: 0 })}
                >
                  {mdTitle}
                </h2>
              </div>
            )}
            <div className="ml-auto space-x-1 flex items-start">
              <Search
                className="hidden md:block mr-2"
                hydrate={{ on: 'media (min-width: 768px)' }}
              />
              <ClientOnly fallback={<button className="w-9" />}>
                <Button
                  variant="ghost"
                  size="icon"
                  icon={theme === 'light' ? <SunIcon /> : <MoonStarIcon />}
                  onClick={handleSwitchTheme}
                />
              </ClientOnly>
              <a
                href="https://github.com/Codpoe/servite"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost" size="icon" icon={<GithubIcon />} />
              </a>
            </div>
          </div>
          {Boolean(matchedSidebarItems?.length) && (
            <div
              className="sm:hidden sticky top-14 z-30 h-9 px-5 sm:px-7 flex items-center space-x-2 font-medium cursor-pointer border-t border-border"
              onClick={() => setFixedSidebarVisible(true)}
            >
              <MenuIcon width={12} />
              {matchedSidebarItems?.map((x, index) => (
                <Fragment key={index}>
                  <span key={index} className="text-xs">
                    {x.title}
                  </span>
                  {index < matchedSidebarItems.length - 1 && (
                    <ChevronRightIcon width={12} />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </header>
        <div className="max-w-[1380px] mx-auto flex justify-center items-start">
          {matchedSidebarItems?.length ? (
            <DocLayout
              fixedSidebarVisible={fixedSidebarVisible}
              setFixedSidebarVisible={setFixedSidebarVisible}
            />
          ) : (
            <Outlet />
          )}
          <Toc
            hydrate={{ on: 'media (min-width: 1024px)' }}
            className={cn(
              'sticky top-14 pt-6 flex-shrink-0 hidden',
              matchedSidebarItems?.length && 'lg:block',
            )}
          />
        </div>
      </div>
    </>
  );
}
