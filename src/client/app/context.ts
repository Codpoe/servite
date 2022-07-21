import { createContext, useContext } from 'react';
import { AppState } from './types';

export const appContext = createContext<AppState>(null as any);

/**
 * get app state
 */
export function useAppState() {
  return useContext(appContext);
}
