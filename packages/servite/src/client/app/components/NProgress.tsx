import { useNProgress } from '../hooks/useNProgress.js';

export function NProgress() {
  useNProgress(true, 200);
  return null;
}
