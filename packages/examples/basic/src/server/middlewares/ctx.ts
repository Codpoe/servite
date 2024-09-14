import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware({
  onRequest: event => {
    // eslint-disable-next-line no-console
    console.log('[middleware:ctx] extend ctx');
    event.context.hello = 'world';
  },
  onBeforeResponse: () => {
    // eslint-disable-next-line no-console
    console.log('[middleware:ctx] before response');
  },
});
