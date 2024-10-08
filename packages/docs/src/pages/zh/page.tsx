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
    description: '默认启用 SSR，但也切换 SSG 和 CSR。',
    to: '/zh/guide/ssr',
    cta: '了解更多',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:row-start-1 md:row-end-4 md:col-start-2 md:col-end-3',
  },
  {
    Icon: FileTextIcon,
    name: 'SSG',
    description: '如果站点大部分内容都是静态的，可方便地切换到 SSG。',
    to: '/zh/guide/ssg',
    cta: '了解更多',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3',
  },
  {
    Icon: MonitorCheckIcon,
    name: 'CSR',
    description: '支持自动或手动降级为 CSR。',
    to: '/zh/guide/csr',
    cta: '了解更多',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4',
  },
  {
    Icon: TreePalmIcon,
    name: 'Islands',
    description: '改进 Islands 孤岛架构，开发更友好',
    to: '/zh/guide/islands',
    cta: '了解更多',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-2',
  },
  {
    Icon: ServerIcon,
    name: 'Vinxi',
    description: 'Servite 底层由 Vinxi / Nitro 驱动，稳定可靠，部署便捷。',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'md:col-start-3 md:col-end-3 md:row-start-2 md:row-end-4',
  },
];

export default function Page() {
  return (
    <div className="flex-1 px-5 sm:px-7 pb-8 flex flex-col items-center">
      <h1 className="text-foreground relative mx-5 max-w-[43.5rem] pt-5 mt-20 mb-8 md:mx-auto md:px-4 md:py-2 text-balance text-center font-semibold tracking-tight text-5xl sm:text-7xl md:text-7xl lg:text-7xl">
        全栈的 React 开发框架
      </h1>
      <Link className="mb-8" to="/zh/guide">
        <Button size="lg">快速开始</Button>
      </Link>
      <BentoGrid className="md:grid-rows-3">
        {features.map(feature => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
