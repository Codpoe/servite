import { defineMiddleware } from 'servite/runtime/server';

export default defineMiddleware(async (event, next) => {
  event.context.html?.inject({
    injectTo: 'body',
    tag: 'script',
    children: 'console.log("hello world from middleware")',
  });
  await next();
});
