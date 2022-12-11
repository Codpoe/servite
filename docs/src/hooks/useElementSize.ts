import { useState, DependencyList } from 'react';
import { useResize } from './useResize';

export function useElementSize(
  target: Element | null | (() => Element | null),
  options?: ResizeObserverOptions,
  deps?: DependencyList
) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useResize(
    ([entry]) => {
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    },
    { target, options, deps }
  );

  return { width, height };
}
