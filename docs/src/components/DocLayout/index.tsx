import { useMemo } from 'react';
import { isEqual } from 'ufo';
import { Outlet, useAppState } from 'servite/client';
import { SidebarItem } from '@/types';
import { useSiteState } from '@/context';
import { Sidebar } from '../Sidebar';
import { Mdx } from '../Mdx';
import { UpdateInfo } from '../UpdateInfo';
import { PrevNext } from '../PrevNext';
import { Toc } from '../Toc';
import './index.css';

export function DocLayout() {
  const { pagePath, pageModule } = useAppState();
  const { sidebar } = useSiteState();

  const activeSidebar = useMemo<SidebarItem[]>(() => {
    if (!pagePath || !sidebar?.length) {
      return [];
    }

    const res: SidebarItem[] = [];

    const find = (items: SidebarItem[]) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.link && isEqual(item.link, pagePath)) {
          res.push(item);
          return true;
        }

        if (item.items?.length) {
          res.push(item);

          if (find(item.items)) {
            return true;
          }
          res.pop();
        }
      }

      return false;
    };

    find(sidebar);

    return res;
  }, [pagePath, sidebar]);

  const hasSidebar = sidebar && sidebar?.length > 0 && activeSidebar.length > 0;
  const hasToc = Boolean(pageModule?.toc?.length);

  return (
    <div className="max-w-[90rem] w-full mx-auto lg:flex relative">
      {hasSidebar && (
        <Sidebar
          __island={'idle'}
          items={sidebar}
          activeItems={activeSidebar}
        />
      )}
      <div
        key={pagePath}
        className={`flex-1 w-full ${
          hasSidebar ? 'lg:pl-[var(--left-aside-width)]' : ''
        } ${hasSidebar || hasToc ? 'xl:pr-[var(--right-aside-width)]' : ''}`}
      >
        <div className="max-w-[850px] min-w-0 w-full mx-auto pt-8 pb-24 px-6 md:px-8">
          <Mdx className="mb-16">
            <Outlet />
          </Mdx>
          <UpdateInfo />
          <PrevNext />
        </div>
      </div>
      {(hasSidebar || hasToc) && (
        <div className="hidden xl:block absolute top-0 right-0 w-[var(--right-aside-width)] h-full">
          <div className="sticky top-[calc(var(--header-height)+var(--banner-height))] max-h-[calc(100vh-var(--header-height)-var(--banner-height))] pt-8 pb-24 pl-3 overflow-y-auto">
            <Toc __island={'visible'} key={pagePath} />
          </div>
        </div>
      )}
    </div>
  );
}
