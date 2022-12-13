export const isBrowser = typeof document !== 'undefined';

// Ssr will inject global variable: `__SERVITE__ssrData`
export const ssrData = isBrowser ? window.__SERVITE__ssrData : undefined;

export const hasIslands = !!ssrData?.hasIslands;
