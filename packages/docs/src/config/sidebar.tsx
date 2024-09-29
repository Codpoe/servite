import { SidebarItemProps, SidebarGroupProps } from 'shadcn-react';

export const sidebarItems: (SidebarGroupProps | SidebarItemProps)[] = [
  {
    title: '介绍',
    value: '/zh/guide',
  },
  {
    title: '开始上手',
    value: '/zh/guide/start',
  },
  {
    title: '配置',
    value: '/zh/guide/config',
  },
  {
    title: '目录结构',
    value: '/zh/guide/directory-structure',
  },
  {
    title: '路由',
    value: '/zh/guide/routes',
  },
  {
    title: '路由数据',
    value: '/zh/guide/routes-data',
  },
  {
    title: '路由错误',
    value: '/zh/guide/routes-error',
  },
  {
    title: '服务中间件',
    value: '/zh/guide/middlewares',
  },
  {
    title: 'SSR 服务端渲染',
    value: '/zh/guide/ssr',
  },
  {
    title: 'SSG 静态生成',
    value: '/zh/guide/ssg',
  },
  {
    title: 'CSR 客户端渲染',
    value: '/zh/guide/csr',
  },
  {
    title: '部署',
    value: '/zh/guide/deploy',
  },
  {
    title: '进阶',
    children: [
      {
        title: '运行时能力',
        value: '/zh/guide/runtime',
      },
      {
        title: '一体化 API 调用',
        value: '/zh/guide/unified-invocation',
      },
      {
        title: '自定义服务端 logger',
        value: '/zh/guide/custom-logger',
      },
      {
        title: 'islands - 孤岛架构',
        value: '/zh/guide/islands',
      },
    ],
  },
];
