import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware((event, next) => {
  // eslint-disable-next-line no-console
  console.log('[middleware:log] request path', event.path);
  return next();
});
