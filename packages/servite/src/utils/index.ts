import { defu } from 'defu';

export function defaults<T extends Record<string, any>, K extends T>(
  origin: T | undefined,
  defaultValue: K,
): Omit<T, keyof K> &
  Required<Pick<T, keyof K extends keyof T ? keyof K : never>> {
  return defu(origin, defaultValue) as any;
}

export function toArray<T>(value: T | Array<T> = []): Array<T> {
  return Array.isArray(value) ? value : [value];
}
