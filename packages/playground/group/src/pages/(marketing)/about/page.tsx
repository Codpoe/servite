import { PrefetchLink } from 'servite/client';

export default function About() {
  return (
    <div>
      About
      <div>
        <PrefetchLink to="/blog">PrefetchLink to /blog</PrefetchLink>
      </div>
    </div>
  );
}
