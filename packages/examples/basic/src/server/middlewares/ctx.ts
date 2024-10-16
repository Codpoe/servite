import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware(async (event, next) => {
  // console.log('[middleware:ctx] extend ctx', event.path);
  event.context.hello = 'world';
  await next();

  // console.log('[middleware:ctx] before response', event.path);
});
