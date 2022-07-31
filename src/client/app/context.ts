import { createContext, useContext } from 'react';
import { AppState, LoaderResult } from './types.js';

export const appContext = createContext<AppState>(null as any);

/**
 * get app state
 */
export function useAppState() {
  return useContext(appContext);
}

/**
 * get loader data
 */
export function useLoaderData<T extends LoaderResult = LoaderResult>(): T {
  return useAppState().loaderData as T;
}
