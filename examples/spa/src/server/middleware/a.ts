import { defineEventHandler } from 'servite/server';

export default defineEventHandler(event => {
  // eslint-disable-next-line no-console
  console.log('middleware a', event.path);
});
