/**
 * Based on Geist UI. https://react.geist-ui.dev/en-us/components/loading
 */
import './index.css';

export interface LoadingProps {
  className?: string;
}

export function Loading({ className = '' }: LoadingProps) {
  return (
    <div
      className={`flex justify-center items-center select-none relative min-h-[1em] ${className}`}
    >
      <i className="loading-dot" />
      <i className="loading-dot" />
      <i className="loading-dot" />
    </div>
  );
}
