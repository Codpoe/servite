import { useNProgress } from '../hooks/useNProgress';

export function NProgress() {
  useNProgress(true, 200);
  return null;
}
