// vite.config.ts
import { defineConfig } from "file:///Users/bytedance/Documents/my-projects/servite/node_modules/.pnpm/vite@5.0.4_@types+node@18.0.3/node_modules/vite/dist/node/index.js";
import { servite } from "file:///Users/bytedance/Documents/my-projects/servite/packages/servite/dist/node/index.js";
import { tsAlias } from "file:///Users/bytedance/Documents/my-projects/servite/node_modules/.pnpm/vite-plugin-ts-alias@0.1.1/node_modules/vite-plugin-ts-alias/dist/index.mjs";
import { mdxPlus } from "file:///Users/bytedance/Documents/my-projects/servite/node_modules/.pnpm/vite-plugin-mdx-plus@1.1.1_rollup@4.6.1/node_modules/vite-plugin-mdx-plus/dist/index.js";
import icons from "file:///Users/bytedance/Documents/my-projects/servite/node_modules/.pnpm/unplugin-icons@0.18.0_@svgr+core@8.1.0/node_modules/unplugin-icons/dist/vite.js";
var vite_config_default = defineConfig({
  base: process.env.GH_PAGES ? "/servite/" : "/",
  ssr: {
    noExternal: ["@docsearch/react", "algoliasearch"]
  },
  plugins: [
    servite({
      ssg: ["**/*"],
      islands: process.env.NODE_ENV === "production"
    }),
    tsAlias(),
    mdxPlus({
      theme: {
        light: "github-light",
        dark: "github-dark"
      },
      autolinkHeadings: {
        properties: {
          class: "header-anchor",
          ariaHidden: "true",
          tabIndex: -1
        },
        content: {
          type: "text",
          value: "#"
        }
      }
    }),
    icons({
      compiler: "jsx",
      autoInstall: true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYnl0ZWRhbmNlL0RvY3VtZW50cy9teS1wcm9qZWN0cy9zZXJ2aXRlL3BhY2thZ2VzL2RvY3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ieXRlZGFuY2UvRG9jdW1lbnRzL215LXByb2plY3RzL3NlcnZpdGUvcGFja2FnZXMvZG9jcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYnl0ZWRhbmNlL0RvY3VtZW50cy9teS1wcm9qZWN0cy9zZXJ2aXRlL3BhY2thZ2VzL2RvY3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHNlcnZpdGUgfSBmcm9tICdzZXJ2aXRlJztcbmltcG9ydCB7IHRzQWxpYXMgfSBmcm9tICd2aXRlLXBsdWdpbi10cy1hbGlhcyc7XG5pbXBvcnQgeyBtZHhQbHVzIH0gZnJvbSAndml0ZS1wbHVnaW4tbWR4LXBsdXMnO1xuaW1wb3J0IGljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogcHJvY2Vzcy5lbnYuR0hfUEFHRVMgPyAnL3NlcnZpdGUvJyA6ICcvJyxcbiAgc3NyOiB7XG4gICAgbm9FeHRlcm5hbDogWydAZG9jc2VhcmNoL3JlYWN0JywgJ2FsZ29saWFzZWFyY2gnXSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHNlcnZpdGUoe1xuICAgICAgc3NnOiBbJyoqLyonXSxcbiAgICAgIGlzbGFuZHM6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgfSksXG4gICAgdHNBbGlhcygpLFxuICAgIG1keFBsdXMoe1xuICAgICAgdGhlbWU6IHtcbiAgICAgICAgbGlnaHQ6ICdnaXRodWItbGlnaHQnLFxuICAgICAgICBkYXJrOiAnZ2l0aHViLWRhcmsnLFxuICAgICAgfSxcbiAgICAgIGF1dG9saW5rSGVhZGluZ3M6IHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNsYXNzOiAnaGVhZGVyLWFuY2hvcicsXG4gICAgICAgICAgYXJpYUhpZGRlbjogJ3RydWUnLFxuICAgICAgICAgIHRhYkluZGV4OiAtMSxcbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICB2YWx1ZTogJyMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBpY29ucyh7XG4gICAgICBjb21waWxlcjogJ2pzeCcsXG4gICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVyxTQUFTLG9CQUFvQjtBQUNuWSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTSxRQUFRLElBQUksV0FBVyxjQUFjO0FBQUEsRUFDM0MsS0FBSztBQUFBLElBQ0gsWUFBWSxDQUFDLG9CQUFvQixlQUFlO0FBQUEsRUFDbEQ7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNOLEtBQUssQ0FBQyxNQUFNO0FBQUEsTUFDWixTQUFTLFFBQVEsSUFBSSxhQUFhO0FBQUEsSUFDcEMsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1I7QUFBQSxNQUNBLGtCQUFrQjtBQUFBLFFBQ2hCLFlBQVk7QUFBQSxVQUNWLE9BQU87QUFBQSxVQUNQLFlBQVk7QUFBQSxVQUNaLFVBQVU7QUFBQSxRQUNaO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLFVBQVU7QUFBQSxNQUNWLGFBQWE7QUFBQSxJQUNmLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
