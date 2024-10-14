import { Suspense } from 'react';
import { Await, useAsyncError, useAsyncValue } from 'react-router-dom';
import type { StaticHandlerContext } from 'react-router-dom/server';

export interface RouterHydrationProps {
  context?: StaticHandlerContext;
}

export function RouterHydration({ context }: RouterHydrationProps) {
  // client
  if (!import.meta.env.SSR) {
    return null;
  }

  // server
  const deferPromises = getDeferPromises(context!);

  return (
    <>
      {deferPromises.map(({ loaderKey, dataKey, promise }) => (
        <DeferPromise
          key={`${loaderKey}-${dataKey}`}
          loaderKey={loaderKey}
          dataKey={dataKey}
          promise={promise}
        />
      ))}
    </>
  );
}

interface DeferPromiseProps {
  loaderKey: string;
  dataKey: string;
  promise: Promise<any>;
}

function DeferPromise({ loaderKey, dataKey, promise }: DeferPromiseProps) {
  return (
    <Suspense>
      <Await
        resolve={promise}
        errorElement={
          <DeferPromiseReject loaderKey={loaderKey} dataKey={dataKey} />
        }
      >
        <DeferPromiseResolve loaderKey={loaderKey} dataKey={dataKey} />
      </Await>
    </Suspense>
  );
}

function DeferPromiseResolve({
  loaderKey,
  dataKey,
}: Omit<DeferPromiseProps, 'promise'>) {
  const data = useAsyncValue();

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__staticRouterHydrationDataPromises['${loaderKey}']['${dataKey}'].resolve(${JSON.stringify(
          data,
        )})`,
      }}
    />
  );
}

const DeferPromiseReject = ({
  loaderKey,
  dataKey,
}: Omit<DeferPromiseProps, 'promise'>) => {
  const data = useAsyncError();

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__staticRouterHydrationDataPromises['${loaderKey}']['${dataKey}'].reject(${JSON.stringify(
          data,
        )})`,
      }}
    />
  );
};

export function getRouterHydrationScript(context?: StaticHandlerContext) {
  if (!context) {
    return '';
  }

  const { loaderData, actionData, errors } = context;

  const json = htmlEscape(
    JSON.stringify(
      JSON.stringify({
        loaderData,
        actionData,
        errors: serializeErrors(errors),
      }),
    ),
  );

  const deferPromises = getDeferPromises(context);

  return `window.__staticRouterHydrationData = JSON.parse(${json});
window.__staticRouterHydrationDataPromises = {};
${deferPromises
  .map(
    ({
      loaderKey,
      dataKey,
    }) => `window.__staticRouterHydrationData.loaderData['${loaderKey}']['${dataKey}'] = new Promise(
  (resolve, reject) => {
    window.__staticRouterHydrationDataPromises['${loaderKey}'] = window.__staticRouterHydrationDataPromises['${loaderKey}'] || {};
    window.__staticRouterHydrationDataPromises['${loaderKey}']['${dataKey}'] = {
      'resolve': resolve,
      'reject': reject
    };
  }
);`,
  )
  .join('\n')}`;
}

function getDeferPromises(context: StaticHandlerContext): DeferPromiseProps[] {
  const loaderKeys = Object.keys(context.loaderData);

  const deferPromises: DeferPromiseProps[] = [];

  loaderKeys.forEach(loaderKey => {
    const data = context.loaderData[loaderKey];

    if (typeof data === 'object' && data) {
      const dataKeys = Object.keys(data);

      dataKeys.forEach(dataKey => {
        const item = data[dataKey];

        if (typeof item?.then === 'function') {
          deferPromises.push({
            loaderKey,
            dataKey,
            promise: item,
          });
        }
      });
    }
  });

  return deferPromises;
}

// The function below is copied from react-router-dom/server.tsx

/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error: any) {
  return (
    error != null &&
    typeof error.status === 'number' &&
    typeof error.statusText === 'string' &&
    typeof error.internal === 'boolean' &&
    'data' in error
  );
}

function serializeErrors(
  errors: StaticHandlerContext['errors'],
): StaticHandlerContext['errors'] {
  if (!errors) return null;
  const entries = Object.entries(errors);
  const serialized: StaticHandlerContext['errors'] = {};
  for (const [key, val] of entries) {
    // Hey you!  If you change this, please change the corresponding logic in
    // deserializeErrors in react-router-dom/index.tsx :)
    if (isRouteErrorResponse(val)) {
      serialized[key] = { ...val, __type: 'RouteErrorResponse' };
    } else if (val instanceof Error) {
      // Do not serialize stack traces from SSR for security reasons
      serialized[key] = {
        message: val.message,
        __type: 'Error',
        // If this is a subclass (i.e., ReferenceError), send up the type so we
        // can re-create the same type during hydration.
        ...(val.name !== 'Error'
          ? {
              __subType: val.name,
            }
          : {}),
      };
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}

// This utility is based on https://github.com/zertosh/htmlescape
// License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE
const ESCAPE_LOOKUP: { [match: string]: string } = {
  '&': '\\u0026',
  '>': '\\u003e',
  '<': '\\u003c',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const ESCAPE_REGEX = /[&><\u2028\u2029]/g;

function htmlEscape(str: string): string {
  return str.replace(ESCAPE_REGEX, match => ESCAPE_LOOKUP[match]);
}
