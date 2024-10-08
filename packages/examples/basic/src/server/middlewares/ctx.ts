import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware(async (event, next) => {
  // eslint-disable-next-line no-console
  console.log('[middleware:ctx] extend ctx');
  event.context.hello = 'world';

  await next();
  // eslint-disable-next-line no-console
  console.log('[middleware:ctx] before response', event.context.response);
});
