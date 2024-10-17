// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../env.d.ts" />

declare const __META_ENV_SSR__: boolean;

declare module '@vinxi/server-functions/plugin' {
  import { HandlerRouterInput } from 'vinxi';

  export const serverFunctions: {
    client: any;
    server: any;
    router: (
      input?: HandlerRouterInput & { runtime?: string },
    ) => HandlerRouterInput;
  };
}

declare module '@vinxi/server-functions/server-handler' {
  export const handleServerAction: (event: any) => Promise<string | Response>;
}
