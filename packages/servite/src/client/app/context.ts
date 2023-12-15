import { createContext, useContext } from 'react';
import type { Router } from '@remix-run/router';
import type { Page } from '../../shared/types.js';

export interface AppContextValue {
  pages: Page[];
  router: Router;
}

const appContext = createContext<AppContextValue>({
  pages: [],
} as any);

export const AppContextProvider = appContext.Provider;

export function useApp() {
  return useContext(appContext);
}
