import { defineResponseMiddleware } from 'vinxi/http';

export const onBeforeResponse = defineResponseMiddleware(
  async (event, response) => {
    const donePromise = new Promise<void>((resolve, reject) => {
      event.context._resolveMiddlewaresDone = resolve;
      event.context._rejectMiddlewaresDone = reject;
    });
    event.context.response = response.body;
    // restore middlewares execution
    event.context._resolveMiddlewaresRestore?.();
    // wait for all middlewares to finish
    await donePromise;
    // middleware may modify the response, so we need to reassign here
    response.body = event.context.response;
  },
);
