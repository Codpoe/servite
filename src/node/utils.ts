import crypto from 'crypto';
import path from 'upath';
import { MARKDOWN_EXTS } from './constants.js';

export function cleanUrl(url: string): string {
  return url.replace(/#.*$/s, '').replace(/\?.*$/s, '');
}

export function isMarkdown(filePath: string): boolean {
  const extname = path.extname(filePath);
  return MARKDOWN_EXTS.includes(extname);
}

export function randomKey(key: string) {
  return '__SERVITE__' + key + '__' + crypto.randomBytes(20).toString('hex');
}

export function shallowCompare(
  a: Record<string, any>,
  b: Record<string, any>
): boolean {
  const aKeys = Object.keys(a || {});
  const bKeys = Object.keys(b || {});

  return (
    aKeys.length === bKeys.length &&
    aKeys.every(
      key => Object.prototype.hasOwnProperty.call(a, key) && a[key] === b[key]
    )
  );
}
