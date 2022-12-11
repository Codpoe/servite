import { useEffect, DependencyList } from 'react';

export function useMutation(
  callback: MutationCallback,
  params: {
    target: Node | null | (() => Node | null);
    options?: MutationObserverInit;
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

    const observer = new MutationObserver(callback);
    observer.observe(target, options);

    return () => {
      observer.disconnect();
    };
  }, deps || []);
}
