import { defineConfig } from 'vite';
import { servite } from 'servite';
import { tsAlias } from 'vite-plugin-ts-alias';
import { mdxPlus } from 'vite-plugin-mdx-plus';
import icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GH_PAGES ? '/servite/' : '/',
  ssr: {
    noExternal: ['@docsearch/react', 'algoliasearch'],
  },
  plugins: [
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
    servite({
      ssg: ['**/*'],
      islands: process.env.NODE_ENV === 'production',
    }),
    tsAlias(),
    icons({
      compiler: 'jsx',
      autoInstall: true,
    }),
  ],
});
