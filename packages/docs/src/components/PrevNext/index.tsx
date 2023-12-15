import { useMemo } from 'react';
import { isEqual } from 'ufo';
import { useLocation } from 'servite/client';
import { SidebarItem } from '@/types';
import { useSite } from '@/context';
import { Link } from '../Link';
import { ChevronLeft, ChevronRight } from '../Icons';

function Item({ type, item }: { type: 'prev' | 'next'; item?: SidebarItem }) {
  if (!item) {
    return <div></div>;
  }

  return (
    <Link
      className="group max-w-[48%] font-medium"
      to={item.link}
      color={false}
    >
      {type === 'prev' ? (
        <div className="flex items-center text-xs text-c-text-2 group-hover:text-c-text-1 transition-colors">
          <ChevronLeft className="mr-0.5" />
          Previous
        </div>
      ) : (
        <div className="flex items-center justify-end text-xs text-c-text-2 group-hover:text-c-text-1 transition-colors">
          Next
          <ChevronRight className="ml-0.5" />
        </div>
      )}
      <div
        className={`mt-1 text-base text-c-brand group-hover:text-c-brand-light transition-colors ${
          type === 'prev' ? 'text-left' : 'text-right'
        }`}
      >
        {item.text}
      </div>
    </Link>
  );
}

export function PrevNext() {
  const { pathname } = useLocation();
  const { sidebar } = useSite();

  const { prev, next } = useMemo<{
    prev?: SidebarItem;
    next?: SidebarItem;
  }>(() => {
    let _prev: SidebarItem | undefined;
    let _next: SidebarItem | undefined;
    let found = false;

    function find(items: SidebarItem[] = []) {
      if (!pathname) {
        return;
      }

      for (let i = 0; i < items.length; i++) {
        if (_next) {
          break;
        }

        if (items[i].items) {
          find(items[i].items);
          continue;
        }

        if (found) {
          _next = items[i];
          break;
        }

        if (items[i].link && isEqual(items[i].link!, pathname)) {
          found = true;
          continue;
        }

        _prev = items[i];
      }
    }

    find(sidebar);

    // not found, indicating that the current path does not have a sidebar and prev/next
    if (!found) {
      return {};
    }

    return { prev: _prev, next: _next };
  }, [sidebar, pathname]);

  if (!prev && !next) {
    return null;
  }

  return (
    <div className="flex justify-between items-start mt-4 pt-4 space-x-8 border-t border-c-border-1">
      <Item type="prev" item={prev} />
      <Item type="next" item={next} />
    </div>
  );
}
