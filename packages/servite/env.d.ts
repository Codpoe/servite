interface Window {
  __servite__?: {
    ssr: boolean;
    ssrFallback?: boolean;
  };
}

interface ImportMetaEnv {
  SERVER_BASE: string;
  ROUTER_SERVER_BASE: string;
  ROUTER_SSR_BASE: string;
  ROUTER_NAME: 'server' | 'server-fns' | 'ssr' | 'client';
}
