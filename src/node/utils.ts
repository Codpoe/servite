import path from 'upath';
import { MARKDOWN_EXTS } from './constants.js';

export function cleanUrl(url: string): string {
  return url.replace(/#.*$/s, '').replace(/\?.*$/s, '');
}

export function isMarkdown(filePath: string): boolean {
  const extname = path.extname(filePath);
  return MARKDOWN_EXTS.includes(extname);
}
