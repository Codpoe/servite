// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../env.d.ts" />

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
