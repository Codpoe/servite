import { Middleware } from 'koa';

const user: Middleware = (ctx, next) => {
  ctx.body = {
    username: 'koa',
    email: 'user@koa.com',
  };
  return next();
};

export default user;
