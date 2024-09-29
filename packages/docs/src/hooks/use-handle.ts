import { useMatches } from 'servite/runtime/router';

interface Handle {
  frontmatter?: Record<string, any>;
  toc?: {
    id: string;
    text: string;
    depth: number;
  }[];
}

export function useHandle(): Handle {
  const matches = useMatches();
  return matches[matches.length - 1]?.handle || {};
}
