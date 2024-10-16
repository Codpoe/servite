import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware(async (event, next) => {
  // console.log('[middleware:res] res', event.path);
  await next();

  // console.log('[middleware:res] res end', event.path);

  if (event.path === '/server/user') {
    event.context.response = {
      ...event.context.response,
      middleware: 'modify res',
    };
  }
});
