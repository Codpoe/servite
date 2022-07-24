import { Handler } from 'express';

const user: Handler = (req, res, next) => {
  res.json({
    username: 'koa',
    email: 'user@koa.com',
  });
  return next();
};

export default user;
