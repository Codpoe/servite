import { fromNodeMiddleware } from 'servite/server';

export default fromNodeMiddleware((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('middleware log', req.url);
  next();
});
