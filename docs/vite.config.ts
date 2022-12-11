import { defineConfig } from 'vite';
import { servite } from 'servite';
import { tsAlias } from 'vite-plugin-ts-alias';
import { mdxPlus } from 'vite-plugin-mdx-plus';
import icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: ['@docsearch/react'],
  },
  plugins: [
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
    icons({
      compiler: 'jsx',
      autoInstall: true,
    }),
  ],
});
