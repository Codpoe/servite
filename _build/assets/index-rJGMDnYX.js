import{j as t}from"./jsx-runtime-OjB1YB6s.js";import{u as o}from"./index-Crl2ozBJ.js";const x={commitTime:1728541837},d=[{id:"介绍",text:"介绍",depth:1},{id:"项目初衷",text:"项目初衷",depth:2},{id:"为什么基于-vinxi",text:"为什么基于 vinxi",depth:2}];function r(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",...o(),...e.components},{Callout:i}=n;return i||s("Callout"),t.jsxs(t.Fragment,{children:[t.jsx(n.h1,{id:"介绍",children:"介绍"}),`
`,t.jsx(i,{type:"warning",children:t.jsxs(n.p,{children:[`这个项目主要是为了实践自己对一个全栈 React 开发框架的一些想法，以及满足我个人的需求，
没有做太多封装、边界处理等，项目很多地方是考虑不周的，并且功能还在逐渐完善的过程当中，所以本项目不适合作为一个生产环境的项目。
如果你需要一个完整的 React 开发框架，可以考虑使用 `,t.jsx(n.a,{href:"https://nextjs.org/",children:"Next.js"}),"、",t.jsx(n.a,{href:"https://remix.run/",children:"Remix"}),"..."]})}),`
`,t.jsxs(n.p,{children:[t.jsx(n.code,{children:"Servite"})," 是一个基于 ",t.jsx(n.a,{href:"https://github.com/nksaraf/vinxi",children:"vinxi"})," 的全栈 React 开发框架。"]}),`
`,t.jsx(n.h2,{id:"项目初衷",children:"项目初衷"}),`
`,t.jsxs(n.p,{children:[`在日常的开发工作中，我陆续使用过不少 React 全栈开发框架，而在使用过程中逐渐积累了自己对 React 开发框架的一些想法，
比如说目录结构、路由、SSR 等等，我想要把这些想法都实现到一个框架中，并且希望这个框架是能够满足我个人的需求，并且是足够简单的。
这就是 `,t.jsx(n.code,{children:"Servite"})," 的开发初衷。"]}),`
`,t.jsx(n.h2,{id:"为什么基于-vinxi",children:"为什么基于 vinxi"}),`
`,t.jsxs(n.p,{children:["在最开始的时候，我是直接基于 ",t.jsx(n.a,{href:"https://github.com/unjs/nitro",children:"nitro"}),` 来开发的，后来才了解到 vinxi，其实 vinxi 也是基于 nitro 开发的，只是它在这基础上做了一些开发框架相关的封装，
这使得它很适合用来开发全栈 React 开发框架，并且在社区中也有很多基于 vinxi 的开发框架，比如说 `,t.jsx(n.a,{href:"https://github.com/solidjs/solid-start",children:"SolidStart"}),"、",t.jsx(n.a,{href:"https://github.com/tanstack/router",children:"TanStackStart"}),`。
所以 vinxi 的可靠性应该是没什么问题的，并且能够降低开发的复杂度，所以我后来改为基于 vinxi 来开发 `,t.jsx(n.code,{children:"Servite"})," 了。"]}),`
`,t.jsxs(n.p,{children:[`不过真的吐槽一句，vinxi 的文档写得太烂了，很多细节都是我翻看它的源码才知道的。而且它是用 JS 来写的，虽然通过 JSDoc 注释来补充了一些类型，
但很多类型是不准确的，这导致我在开发的时候需要写一些 `,t.jsx(n.code,{children:"as any"})," 来绕过类型检查。"]})]})}function a(e={}){const{wrapper:n}={...o(),...e.components};return n?t.jsx(n,{...e,children:t.jsx(r,{...e})}):r(e)}function s(e,n){throw new Error("Expected component `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{a as default,x as frontmatter,d as toc};
