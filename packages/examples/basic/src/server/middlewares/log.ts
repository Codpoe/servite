import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware(async (event, next) => {
  // eslint-disable-next-line no-console
  console.log('[middleware:log] request path', event.path);
  await next();
  // eslint-disable-next-line no-console
  console.log('[middleware:log] request path end', event.path);
});
