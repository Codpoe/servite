import type { RouteObject } from 'react-router-dom';
import { createContext, useContext } from 'react';
import type { Page } from '../../shared/types.js';

export interface AppContextValue {
  pages: Page[];
  routes: RouteObject[];
}

const appContext = createContext<AppContextValue>({
  pages: [],
  routes: [],
});

export const AppContextProvider = appContext.Provider;

export function useApp() {
  return useContext(appContext);
}
