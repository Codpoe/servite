export function throttle(fn: (...args: any[]) => any, delay: number) {
  let timer: any = null;
  let lastArgs: any[] | null = null;
  let lastThis: any | null = null;

  function throttled(this: any, ...args: any[]) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, delay);
    }
  }

  return throttled;
}

export function debounce(fn: (...args: any[]) => any, delay: number) {
  let timer: any = null;

  function debounced(this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }

  return debounced;
}
