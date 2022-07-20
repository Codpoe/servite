import { useState, useEffect, createContext, useContext } from 'react';
import { useSnapshot } from 'valtio';
import importedThemeConfig from '/@pressify/theme-config';
import { AppState } from './types';

export const appContext = createContext<AppState>(null as any);

/**
 * get app state
 */
export function useAppState() {
  const appState = useContext(appContext);
  return useSnapshot(appState) as AppState;
}

/**
 * get theme config
 */
export function useThemeConfig<T = any>(): T {
  const [themeConfig, setThemeConfig] = useState(importedThemeConfig);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept('/@pressify/theme-config', mod => {
        mod && setThemeConfig(mod.default);
      });
    }
  }, []);

  return themeConfig;
}

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
