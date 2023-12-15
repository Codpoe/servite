import { useMemo } from 'react';
import { isEqual } from 'ufo';
import { ClientOnly, Outlet, useLocation } from 'servite/client';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { SidebarItem } from '@/types';
import { useSite } from '@/context';
import { Sidebar } from '../Sidebar';
import { Mdx } from '../Mdx';
import { UpdateInfo } from '../UpdateInfo';
import { PrevNext } from '../PrevNext';
import { Toc } from '../Toc';
import './index.css';

export function DocLayout() {
  const { pathname } = useLocation();
  const { routeHandle, sidebar } = useSite();

  const activeSidebar = useMemo<SidebarItem[]>(() => {
    if (!sidebar.length) {
      return [];
    }

    const res: SidebarItem[] = [];

    const find = (items: SidebarItem[]) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.link && isEqual(item.link, pathname)) {
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
  }, [pathname, sidebar]);

  const hasSidebar = sidebar && sidebar?.length > 0 && activeSidebar.length > 0;
  const hasToc = Boolean(routeHandle?.module?.toc?.length);

  return (
    <div className="max-w-[90rem] w-full mx-auto lg:flex relative">
      {hasSidebar && (
        <Sidebar
          __island={'idle'}
          items={sidebar}
          activeItems={activeSidebar}
        />
      )}
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={pathname}
          classNames="page-slide"
          addEndListener={(node, done) =>
            node.addEventListener('transitionend', done, false)
          }
        >
          <div
            className={`flex-1 w-full ${
              hasSidebar ? 'lg:pl-[var(--left-aside-width)]' : ''
            } ${
              hasSidebar || hasToc ? 'xl:pr-[var(--right-aside-width)]' : ''
            }`}
          >
            <div className="max-w-[850px] min-w-0 w-full mx-auto pt-8 pb-24 px-6 md:px-8">
              <Mdx className="mb-16">
                <Outlet />
              </Mdx>
              <ClientOnly>
                <UpdateInfo />
              </ClientOnly>
              <PrevNext />
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
      {(hasSidebar || hasToc) && (
        <div className="hidden xl:block absolute top-0 right-0 w-[var(--right-aside-width)] h-full">
          <div className="sticky top-[calc(var(--header-height)+var(--banner-height))] max-h-[calc(100vh-var(--header-height)-var(--banner-height))] pt-8 pb-24 pl-3 overflow-y-auto">
            <Toc __island={'visible'} key={pathname} />
          </div>
        </div>
      )}
    </div>
  );
}
