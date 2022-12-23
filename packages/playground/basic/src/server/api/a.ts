import { apiHandler } from 'servite/server';

export interface Args {
  foo: string;
  bar?: string;
}

export interface Result {
  code: number;
  msg: string;
  data?: string;
}

export default apiHandler<Args, Result>((args, event) => {
  // eslint-disable-next-line no-console
  console.log('api eventHandler', args, event.path);
  return {
    code: 0,
    msg: 'ok',
    data: event.path,
  };
});
