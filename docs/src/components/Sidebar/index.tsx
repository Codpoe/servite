import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useAppState } from 'servite/client';
import { SidebarItem } from '@/types';
import { Link } from '../Link';
import { TextWithIcon } from '../TextWithIcon';
import { CaretRight, ChevronRight } from '../Icons';

import './index.css';

export interface SidebarProps {
  items: SidebarItem[];
  activeItems: SidebarItem[];
}

export function Sidebar({ items, activeItems }: SidebarProps) {
  const { pagePath } = useAppState();
  const [open, setOpen] = useState(false);

  // close sidebar when path is changed
  useEffect(() => {
    setOpen(false);
  }, [pagePath]);

  return (
    <>
      <div
        className="sticky z-[var(--z-index-sidebar-indicator)] top-[calc(var(--header-height)+var(--banner-height))] w-full h-[var(--sidebar-indicator-height)]
      bg-c-bg-0 border-b border-b-c-border-1
      flex lg:hidden items-center px-6"
      >
        <div
          className="h-full flex items-center text-xs text-c-text-1 font-medium cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <CaretRight className="text-lg -ml-[5px] mr-2" />
          {activeItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <TextWithIcon text={item.text} icon={item.icon} space="4px" />
              {index < activeItems.length - 1 && (
                <ChevronRight className="mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
      <CSSTransition
        classNames="sidebar-mask"
        in={open}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div
          className="fixed lg:hidden z-[var(--z-index-sidebar-mask)] top-0 left-0 right-0 bottom-0 bg-black/60"
          onClick={() => setOpen(false)}
        ></div>
      </CSSTransition>
      <div
        className={`
        fixed z-[var(--z-index-sidebar-drawer)] top-0 right-full bottom-0 w-[75vw] max-w-[320px] px-4
        lg:z-[var(--z-index-sidebar)] lg:top-[calc(var(--header-height)+var(--banner-height))] lg:right-auto lg:w-[var(--left-aside-width)]
        transition-transform duration-300 pt-8 pb-24 overflow-y-auto bg-c-bg-0
        ${open ? 'translate-x-full lg:translate-x-0' : ''}`}
      >
        {items.map((item, index) => {
          if (item.items) {
            return (
              <div key={index} className="my-7">
                <h2 className="mb-2 px-2 flex items-center text-[13px] font-bold text-c-text-2">
                  <TextWithIcon text={item.text} icon={item.icon} space="8px" />
                </h2>
                <div className="ml-2 pl-[5px] border-l border-l-c-border-1">
                  {item.items.map((subItem, subIndex) => (
                    <SidebarLink
                      key={subIndex}
                      item={subItem}
                      active={isActiveSidebarItem(activeItems, subItem)}
                    />
                  ))}
                </div>
              </div>
            );
          }

          return (
            <SidebarLink
              key={index}
              item={item}
              active={isActiveSidebarItem(activeItems, item)}
            />
          );
        })}
      </div>
    </>
  );
}

function SidebarLink({ item, active }: { item: SidebarItem; active: boolean }) {
  return (
    <Link
      to={item.link}
      color={false}
      className={`relative flex items-center min-h-[34px] mb-[3px] px-2 py-1.5 text-sm font-medium transition-all
      ${
        active
          ? 'text-c-brand font-medium before:opacity-[0.12]'
          : 'text-c-text-1 before:opacity-0 hover:before:opacity-[0.06]'
      }
      before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:rounded-md before:bg-current before:z-[-1] before:transition-opacity`}
    >
      <TextWithIcon text={item.text} icon={item.icon} space="8px" />
    </Link>
  );
}

function isActiveSidebarItem(activeItems: SidebarItem[], item: SidebarItem) {
  return activeItems.some(x => x.link === item.link && x.text === item.text);
}
