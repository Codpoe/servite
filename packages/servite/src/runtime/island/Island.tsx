import { useEffect, useState } from 'react';
import {
  canManuallyHydrateIsland,
  HYDRATE_EVENT_NAME,
  HydrateOptions,
} from './shared.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'servite-island': React.DetailedHTMLProps<React.HTMLAttributes<any>, any>;
    }
  }
}

export interface IslandProps {
  [key: string]: any;
  innerRef?: React.Ref<any>;
  hydrate: HydrateOptions & { load: () => Promise<any>; id: string };
}

interface IslandState {
  innerHtml?: string;
  Component?: any;
}

const cache: Record<string, IslandState> = {};

export function Island({ innerRef, hydrate, ...restProps }: IslandProps) {
  const [islandState, setIslandState] = useState(() => ({
    innerHtml: document.getElementById(hydrate.id)?.innerHTML || '',
    Component: cache[hydrate.id]?.Component,
  }));

  useEffect(() => {
    if (!hydrate.on) {
      return;
    }

    const doHydrate = async () => {
      if (cache[hydrate.id]?.Component) {
        return;
      }

      const { default: Component } = await hydrate.load();
      cache[hydrate.id] = { Component };
      setIslandState(prev => ({ ...prev, Component }));
    };

    switch (hydrate.on) {
      case 'load': {
        doHydrate();
        break;
      }
      case 'idle': {
        (window.requestIdleCallback || ((cb: any) => setTimeout(cb, 100)))(
          doHydrate,
        );
        break;
      }
      case 'visible': {
        const islandEl = document.getElementById(hydrate.id);
        if (!islandEl) {
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.error(`Miss island (id: ${hydrate.id})`);
          }
          break;
        }
        const observer = new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue;
            }
            observer.disconnect();
            doHydrate();
            break;
          }
        });

        for (const child of Array.from(islandEl.children)) {
          observer.observe(child);
        }
        break;
      }
      case 'manual': {
        const manualHydrate = () => {
          if (canManuallyHydrateIsland(hydrate.id)) {
            doHydrate();
            window.removeEventListener(HYDRATE_EVENT_NAME, manualHydrate);
            return true;
          }
          return false;
        };
        if (!manualHydrate()) {
          window.addEventListener(HYDRATE_EVENT_NAME, manualHydrate);
        }
        break;
      }
      default: {
        if (hydrate.on.startsWith('media ')) {
          const mq = hydrate.on.replace('media ', '');
          const mql = window.matchMedia(mq);
          if (mql.matches) {
            doHydrate();
          } else {
            mql.addEventListener('change', ev => {
              if (ev.matches) {
                doHydrate();
              }
            });
          }
          break;
        }

        // eslint-disable-next-line no-console
        console.warn(
          `Unsupported hydrate mode: ${hydrate.on}. Use 'load' | 'idle' | 'visible' | 'manual' | 'media' instead.`,
        );
        doHydrate();
      }
    }

    if (typeof hydrate.timeout === 'number') {
      const timer = setTimeout(() => doHydrate(), hydrate.timeout);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (islandState.Component) {
    return (
      <servite-island
        id={hydrate.id}
        style={{
          display: 'contents',
        }}
      >
        <islandState.Component ref={innerRef} {...restProps} />
      </servite-island>
    );
  }

  return (
    <servite-island
      id={hydrate.id}
      style={{
        display: 'contents',
      }}
      dangerouslySetInnerHTML={{ __html: islandState.innerHtml }}
      suppressHydrationWarning={true}
    />
  );
}
