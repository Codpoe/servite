function isResponse(value: any): value is Response {
  return (
    value != null &&
    typeof value.status === 'number' &&
    typeof value.statusText === 'string' &&
    typeof value.headers === 'object' &&
    typeof value.body !== 'undefined'
  );
}

function isRedirectResponse(response: Response): boolean {
  return response.headers.get('X-Remix-Redirect') != null;
}

// The code in this file will be injected into virtual:servite/pages-routes for HMR
function isCatchResponse(response: Response): boolean {
  return response.headers.get('X-Remix-Catch') != null;
}

function isErrorResponse(response: any): boolean {
  return response.headers.get('X-Remix-Error') != null;
}

function isNetworkErrorResponse(response: any): response is Response {
  // If we reach the Servite server, we can safely identify response types via the
  // X-Remix-Error/X-Remix-Catch headers. However, if we never reach the Servite
  // server, and instead receive a 4xx/5xx from somewhere in between (like
  // Cloudflare), then we get a false negative n the isErrorResponse check and
  // we incorrectly assume that the user returns the 4xx/5xx response and
  // consider it successful. To alleviate this, we add X-Remix-Response to any
  // non-Error/non-Catch responses coming back from the server. If we don't
  // see this, we can conclude that a 4xx/5xx response never actually reached
  // the Servite server and we can bubble it up as an error.
  return (
    isResponse(response) &&
    response.status >= 400 &&
    response.headers.get('X-Remix-Error') == null &&
    response.headers.get('X-Remix-Catch') == null &&
    response.headers.get('X-Remix-Response') == null
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchRouteData(
  request: Request,
  pageFile: string
): Promise<Response | Error> {
  const url = new URL(request.url);
  url.searchParams.set('_data', pageFile);

  const init: RequestInit = { signal: request.signal };

  if (request.method !== 'GET') {
    init.method = request.method;

    const contentType = request.headers.get('Content-Type');

    // Check between word boundaries instead of startsWith() due to the last
    // paragraph of https://httpwg.org/specs/rfc9110.html#field.content-type
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      init.headers = { 'Content-Type': contentType };
      init.body = JSON.stringify(await request.json());
    } else if (contentType && /\btext\/plain\b/.test(contentType)) {
      init.headers = { 'Content-Type': contentType };
      init.body = await request.text();
    } else if (
      contentType &&
      /\bapplication\/x-www-form-urlencoded\b/.test(contentType)
    ) {
      init.body = new URLSearchParams(await request.text());
    } else {
      init.body = await request.formData();
    }
  }

  const response = await fetch(url.href, init);

  // TODO: support deferred

  if (isRedirectResponse(response)) {
    const url = response.headers.get('X-Remix-Redirect')!;
    const status = parseInt(response.headers.get('X-Remix-Status')!, 10) || 302;
    const revalidate = response.headers.get('X-Remix-Revalidate');
    const reloadDocument = response.headers.get('X-Remix-Reload-Document');

    const headers: Record<string, string> = {
      Location: url,
    };

    if (revalidate) {
      headers['X-Remix-Revalidate'] = revalidate;
    }

    if (reloadDocument) {
      headers['X-Remix-Reload-Document'] = reloadDocument;
    }

    throw new Response(null, {
      status,
      headers,
    });
  }

  if (isCatchResponse(response)) {
    throw response;
  }

  if (isErrorResponse(response)) {
    const data = await response.json();
    const error = new Error(data?.message || 'Unexpected Error');
    error.stack = data?.stack;
    throw error;
  }

  if (isNetworkErrorResponse(response)) {
    const text = await response.text();
    const error = new Error(text);
    error.stack = undefined;
    throw error;
  }

  return response;
}
