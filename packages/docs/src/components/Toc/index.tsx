import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'servite/client';
import { throttle, debounce } from 'lodash-es';
import { useScroll } from '@/hooks/useScroll';
import { useSite } from '@/context';
import { Link } from '../Link';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export function Toc() {
  const toc: TocItem[] | undefined = useSite().routeHandle?.module?.toc;

  const [headings, setHeadings] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const elRef = useRef<HTMLDivElement>(null);

  // collect headings by toc
  useEffect(() => {
    const newHeadings = toc
      ?.map(({ id }) => document.getElementById(id))
      .filter((x): x is HTMLElement => !!x);

    setHeadings(newHeadings || []);
    setActiveIndex(-1);
  }, [toc]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle(
      () => {
        if (!elRef.current || !headings.length) {
          return;
        }

        const scrollTop = getScrollTop();

        if (scrollTop === 0) {
          setActiveIndex(-1);
          return;
        }

        const index = headings.findIndex((item, index) => {
          const nextItem = headings[index + 1];
          const { top } = item.getBoundingClientRect();
          const { top: nextTop } = nextItem?.getBoundingClientRect() || {};

          return top <= 100 && (!nextItem || nextTop > 100);
        });

        setActiveIndex(index);
      },
      50,
      { trailing: true }
    ),
    [headings]
  );

  // scroll -> active
  useScroll(handleScroll);

  // activeIndex -> update url hash
  useEffect(() => {
    debouncedUpdateUrlHash(headings[activeIndex]?.id);
  }, [headings, activeIndex]);

  // hash -> active heading scroll into view
  // useHeadingScrollIntoView(headings);

  return (
    <div ref={elRef}>
      <div className="mb-2 text-xs text-c-text-0 font-bold">目录</div>
      <div className="relative">
        <div
          className={`absolute -left-3 w-1 h-5 rounded bg-c-brand transition-all
          ${activeIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: `${Math.max(activeIndex * 28, 0) + 4}px` }}
        />
        {toc?.map((item, index) => (
          <Link
            key={index}
            id={getTocItemId(index)}
            className={`block truncate text-sm leading-7 font-medium text-c-text-1 transition-opacity
              ${
                index === activeIndex
                  ? 'opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            to={`#${item.id}`}
            color={false}
            style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
          >
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
}

const debouncedUpdateUrlHash = debounce((id?: string) => {
  window.history.replaceState(undefined, '', id ? `#${id}` : ' ');
}, 700);

function getScrollTop() {
  return Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop
  );
}

function getTocItemId(index: number) {
  return `toc-item-${index}`;
}

let canScrollIntoView = false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useHeadingScrollIntoView(headings: HTMLElement[]) {
  const { hash } = useLocation();

  // hash -> active heading scroll into view
  useEffect(() => {
    if (hash && headings.length) {
      if (getScrollTop() === 0 || canScrollIntoView) {
        const heading = headings.find(
          ({ id }) => id === decodeURIComponent(hash.replace(/^#/, ''))
        );
        heading?.scrollIntoView();
      }

      canScrollIntoView = true;
    }
  }, [hash, headings]);
}
