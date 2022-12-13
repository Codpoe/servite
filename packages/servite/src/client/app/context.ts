import { createContext, useContext } from 'react';
import { ssrData } from './constants.js';
import { AppState } from './types.js';

export const appContext = createContext<AppState>({
  ...ssrData?.appState,
  routes: [],
  pages: [],
  pageLoading: false,
  pageError: null,
});

/**
 * get app state
 */
export function useAppState() {
  return useContext(appContext);
}

/**
 * get loader data
 */
export function useLoaderData<T = any>(): T {
  return useAppState().loaderData as T;
}
