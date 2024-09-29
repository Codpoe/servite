import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'servite/runtime/router';
import { IslandProps } from 'servite/runtime/island';
import { throttle } from '@/utils/throttle';
import { getScrollTop } from '@/utils/scroll';
import { useHandle } from '@/hooks/use-handle';

export interface TocProps extends IslandProps {
  className?: string;
}

export function Toc({ className = '' }: TocProps) {
  const handle = useHandle();
  const toc = useMemo(() => handle.toc?.filter(x => x.depth > 1), [handle.toc]);
  const [headings, setHeadings] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const elRef = useRef<HTMLDivElement>(null);
  const headingsRef = useRef(headings);
  headingsRef.current = headings;

  // collect headings by toc
  useEffect(() => {
    const newHeadings = toc
      ?.map(({ id }) => document.getElementById(id))
      .filter((x): x is HTMLElement => !!x);

    setHeadings(newHeadings || []);
    setActiveIndex(-1);
  }, [toc]);

  // scroll -> activeIndex
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!elRef.current || !headingsRef.current.length) {
        return;
      }

      const scrollTop = getScrollTop();

      if (scrollTop === 0) {
        setActiveIndex(-1);
        return;
      }

      const index = headingsRef.current.findIndex((item, index) => {
        const nextItem = headingsRef.current[index + 1];
        const { top } = item.getBoundingClientRect();
        const { top: nextTop } = nextItem?.getBoundingClientRect() || {};

        return top <= 100 && (!nextItem || nextTop > 100);
      });

      setActiveIndex(index);
    }, 50);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={elRef} className={`w-64 pr-7 ${className}`}>
      <div className="mb-2 text-xs font-bold">目录</div>
      <div className="relative">
        <div
          className={`absolute -left-3 w-1 h-5 rounded bg-primary transition-all
          ${activeIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: `${Math.max(activeIndex * 28, 0) + 4}px` }}
        />
        {toc?.map((item, index) => (
          <Link
            key={index}
            id={getTocItemId(index)}
            className={`block truncate text-sm leading-7 font-medium transition-opacity
              ${
                index === activeIndex
                  ? 'opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            to={`#${item.id}`}
            style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
          >
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Toc;

function getTocItemId(index: number) {
  return `toc-item-${index}`;
}
