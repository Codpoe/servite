import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware(async (event, next) => {
  await next();

  if (event.path === '/server/user') {
    event.context.response = {
      ...event.context.response,
      middleware: 'modify res',
    };
  }
});
