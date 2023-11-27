import { defineConfig } from 'vite';
import { servite } from 'servite';
import { tsAlias } from 'vite-plugin-ts-alias';
import { mdxPlus } from 'vite-plugin-mdx-plus';
import { nextraDocs } from './vite-plugins/nextra-docs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  ssr: {
    noExternal: ['@docsearch/react'],
    optimizeDeps: {
      exclude: ['nextra-theme-docs'],
    },
  },
  plugins: [
    nextraDocs(),
    servite({
      ssg: ['**/*'],
    }),
    tsAlias(),
    mdxPlus({
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      autolinkHeadings: {
        properties: {
          class: 'header-anchor',
          ariaHidden: 'true',
          tabIndex: -1,
        },
        content: {
          type: 'text',
          value: '#',
        },
      },
    }),
  ],
});
