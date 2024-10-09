import { IslandProps } from 'servite/runtime/island';
import { Input } from 'shadcn-react';
import { SearchIcon } from 'shadcn-react/icons';
import cn from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'servite/runtime/router';
import { debounce } from '@/utils/throttle.js';
import { withoutTrailingSlash } from '@/utils/url.js';
import { getScrollTop } from '@/utils/scroll.js';

interface Pagefind {
  search: (input: string) => Promise<PagefindSearch>;
  debouncedSearch: (input: string) => Promise<PagefindSearch>;
  init: () => Promise<any>;
  options: () => Promise<any>;
  destroy: () => Promise<any>;
}

interface PagefindSearch {
  results: {
    id: string;
    score: number;
    data: () => Promise<PagefindData>;
  }[];
}

interface PagefindAnchor {
  element: string;
  id: string;
  text: string;
}

interface PagefindData {
  anchors: PagefindAnchor[];
  content: string;
  excerpt: string;
  meta: { title: string };
  raw_content: string;
  raw_url: string;
  url: string;
  sub_results: {
    anchor: PagefindAnchor;
    excerpt: string;
    title: string;
    url: string;
  }[];
}

export interface SearchProps extends IslandProps {
  className?: string;
}

export function Search({ className }: SearchProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchData, setSearchData] = useState<PagefindData[]>([]);

  const search = useMemo(
    () =>
      debounce(async (input: string) => {
        if (import.meta.env.DEV) {
          return;
        }

        const pagefind: Pagefind = await import(
          /* @vite-ignore*/
          // @ts-ignore
          '/pagefind/pagefind.js'
        );

        const search = await pagefind.search(input);

        if (!search?.results?.length) {
          setSearchData([]);
          return;
        }

        const data = await Promise.all(
          search.results.slice(0, 5).map(x => x.data()),
        );
        setSearchData(data);
      }, 400),
    [],
  );

  useEffect(() => {
    if (!inputValue) {
      setSearchData([]);
      return;
    }

    search(inputValue);
  }, [inputValue, search]);

  return (
    <div className={cn('relative group', className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 -mt-2 w-4 h-4 text-muted-foreground" />
      <Input
        className="pl-8 pr-10 group-hover:border-foreground/50 group-focus-within:border-foreground/50 transition-colors"
        aria-label="Search"
        autoComplete="off"
        spellCheck="false"
        placeholder="Search"
        defaultValue={inputValue}
        onChange={ev => {
          setInputValue(ev.target.value);
        }}
        onKeyDown={() => {
          // prevent page scroll while typing
          const scrollTop = getScrollTop();
          setTimeout(() => {
            window.scrollTo({ top: scrollTop });
          });
        }}
      />
      <kbd className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 h-5 select-none flex items-center gap-1 rounded border bg-secondary px-1.5 font-mono text-[10px] font-medium opacity-70 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <span className="">⌘</span>K
      </kbd>
      <div
        className={cn(
          'hidden absolute top-full right-0 w-[500px] max-h-[600px] overflow-y-auto mt-2 px-2.5 pb-2.5 bg-secondary rounded-lg border border-border/60 shadow-lg dark:border-border text-sm',
          inputValue && 'group-focus-within:block',
        )}
      >
        {searchData.length ? (
          <div className="">
            {searchData.map(x => {
              const urlPrefix = x.url.substring(
                0,
                x.url.length - x.raw_url.length,
              );

              return (
                <div key={x.url}>
                  <div className="sticky top-0 font-medium text-primary py-2.5 bg-secondary/60 backdrop-blur-sm backdrop-saturate-200">
                    {x.meta.title}
                  </div>
                  <div className="space-y-2.5">
                    {x.sub_results.map(sub => (
                      <Link
                        key={sub.url}
                        className="block px-3.5 py-2.5 bg-background text-foreground shadow-sm border border-transparent rounded-md hover:border-primary transition-all"
                        to={withoutTrailingSlash(
                          sub.url.startsWith(urlPrefix)
                            ? sub.url.slice(urlPrefix.length)
                            : sub.url,
                        )}
                        onClick={() => setInputValue('')}
                      >
                        <div className="font-medium mb-1.5">
                          {sub.anchor.element !== 'h1' && '# '}
                          {sub.title}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{ __html: sub.excerpt }}
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="h-4"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center pt-[30px] pb-5">No result</div>
        )}
      </div>
    </div>
  );
}

export default Search;
