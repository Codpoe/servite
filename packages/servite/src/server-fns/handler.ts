import { defineEventHandler, setResponseHeaders } from 'vinxi/http';
import { handleServerAction } from '@vinxi/server-functions/server-handler';
import { onBeforeResponse } from '../server/on-before-response';

export default defineEventHandler({
  onBeforeResponse: (event, response) => {
    if (response?.body !== undefined) {
      setResponseHeaders(event, {
        'x-servite-server-fns': 1,
      });
      return onBeforeResponse(event, response);
    }
  },
  handler: async event => {
    if (event.path === '/_server') {
      return handleServerAction(event);
    }
  },
});
