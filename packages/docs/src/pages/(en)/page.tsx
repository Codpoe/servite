import {
  FileTextIcon,
  MonitorCheckIcon,
  ServerIcon,
  TreePalmIcon,
  ZapIcon,
} from 'shadcn-react/icons';
import { Button } from 'shadcn-react';
import { Link } from 'servite/runtime/router';
import { BentoCard, BentoCardProps, BentoGrid } from '@/components/Bento';

const features: BentoCardProps[] = [
  {
    Icon: ZapIcon,
    name: 'SSR',
    description: 'SSR enabled by default.',
    to: '/zh/guide/ssr',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:row-start-1 md:row-end-4 md:col-start-2 md:col-end-3',
  },
  {
    Icon: FileTextIcon,
    name: 'SSG',
    description: `If most of the site's content is static, it can easily switch to SSG.`,
    to: '/zh/guide/ssg',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3',
  },
  {
    Icon: MonitorCheckIcon,
    name: 'CSR',
    description: 'Support automatic or manual downgrade to CSR.',
    to: '/zh/guide/csr',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4',
  },
  {
    Icon: TreePalmIcon,
    name: 'Islands',
    description: 'Improve Islands architecture for more development-friendly',
    to: '/zh/guide/islands',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2',
  },
  {
    Icon: ServerIcon,
    name: 'Vinxi',
    description:
      'Servite is driven by Vinxi/Nitro at the bottom layer, stable and reliable, and easy to deploy.',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4',
  },
];

export default function Page() {
  return (
    <div className="flex-1 px-5 sm:px-7 pb-8 flex flex-col items-center">
      <h1 className="text-foreground relative max-w-[43.5rem] pt-5 mt-20 mb-8 md:mx-auto md:px-4 md:py-2 text-balance text-center font-semibold tracking-tight text-5xl sm:text-7xl md:text-7xl lg:text-7xl">
        A Full stack React framework
      </h1>
      <Link className="mb-8" to="/zh/guide">
        <Button size="lg">View zh doc</Button>
      </Link>
      <BentoGrid className="md:grid-rows-3">
        {features.map(feature => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
