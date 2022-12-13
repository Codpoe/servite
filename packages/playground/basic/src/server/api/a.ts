import { eventHandler } from 'servite/server';

export default eventHandler(event => {
  // eslint-disable-next-line no-console
  console.log('api eventHandler', event.path);
  return {
    code: 0,
    msg: 'ok',
    path: event.path,
  };
});
