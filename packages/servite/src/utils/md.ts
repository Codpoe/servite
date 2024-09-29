import { readFileSync } from 'node:fs';
import matter from 'gray-matter';

export function extractFrontmatter(src: string) {
  const content = readFileSync(src, 'utf-8');
  return matter(content).data;
}
