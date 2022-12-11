import { useEffect, DependencyList } from 'react';

export function useResize(
  callback: ResizeObserverCallback,
  params: {
    target: Element | null | (() => Element | null);
    options?: ResizeObserverOptions;
    deps?: DependencyList;
  }
) {
  const { options, deps = [] } = params;
  let { target } = params;

  useEffect(() => {
    if (typeof target === 'function') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      target = target();
    }

    if (!target) {
      return;
    }

    const observer = new ResizeObserver(callback);
    observer.observe(target, options);

    return () => {
      observer.disconnect();
    };
  }, deps);
}
