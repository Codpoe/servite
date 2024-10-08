import { defineEventHandler } from 'servite/runtime/server';

export default defineEventHandler(async event => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    method: event.method,
    path: event.path,
    username: 'asdf',
    age: 18,
    fullPath: event.web?.url,
    url: event.node.req.url,
    originalUrl: event.node.req.originalUrl,
  };
});
