import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware({
  onRequest: event => {
    // eslint-disable-next-line no-console
    console.log('[middleware:log] request path', event.path);
  },
  onBeforeResponse: (_event, response) => {
    // eslint-disable-next-line no-console
    console.log('[middleware:log] response', response);
  },
});
