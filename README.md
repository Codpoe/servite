# servite

A vite plugin for React SSR / SSG / CSR / Islands. Powered by [nitro](https://github.com/unjs/nitro).

To check out docs, visit https://servite.vercel.app.

## Features

- 🌟 SSR by default
- ⚡️ SSG easily
- 🖥 CSR easily
- 🏝 Support islands architecture
- 🔥 Powered by [nitro](https://github.com/unjs/nitro)


---
## TODO
- [x] optional ssr / ssg
  - header: no ssr
- [x] loader params ctx
- [x] useLoaderData
- [x] theme
- [x] copy shared types
- [x] routes deps optimize
- [x] parse docblock for js/ts
- [x] remove theme
- [x] remove shared: union dirs
- [x] custom server render
- [x] jsx dir
- [x] build: prerender
  - [x] ssg config
  - [x] build islands, island-hydrate
  - [x] modify prerender html file
- [x] conflict with complete client hydration
- [x] __islandClient
- [x] collect all matched routes css
- [x] upgrade vite@3.2
- [x] dev hmr
- [x] dev spa: inject entry.client.tsx
- [x] prebuild src/node/pages/enhance.ts
- [x] prebuild ssr-styles-cleaner
- [x] default 404 page
- [x] support custom html template
