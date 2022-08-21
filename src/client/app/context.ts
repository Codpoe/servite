import { createContext, useContext } from 'react';
import { AppState } from './types.js';

export const appContext = createContext<AppState>(null as any);

/**
 * get app state
 */
export function useAppState() {
  return useContext(appContext);
}

export const loaderDataContext = createContext<any>(undefined);

/**
 * get loader data
 */
export function useLoaderData<T = any>(): T {
  return useContext(loaderDataContext);
}
