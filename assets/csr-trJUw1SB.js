import{u as t,j as e}from"./index-qCrzsRmR.js";const a={commitTime:1702629427},c=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2}];function s(r){const n={a:"a",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...t(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsxs(n.h1,{id:"csr---客户端渲染",children:[e.jsx(n.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#csr---客户端渲染",children:"#"}),"CSR - 客户端渲染"]}),`
`,e.jsxs(n.h2,{id:"介绍",children:[e.jsx(n.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,e.jsx(n.p,{children:`CSR（Client-Side Rendering 客户端渲染）是指在浏览器中渲染 Web 应用。
与 SSR / SSG 相比，CSR 会有一些缺点：`}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:`首屏性能会差点，可能会影响 Web 应用的用户体验。
当客户端浏览器请求加载 Web 应用时，服务器会返回 Web 应用的 HTML 和 JavaScript 代码。
浏览器接收到这些代码后，会先把 HTML 渲染成页面，然后执行 JavaScript 代码进行动态渲染。
这样，用户在浏览器加载页面时，可能会先看到「白屏」，然后才会看到渲染完成的 Web 应用。`}),`
`,e.jsx(n.li,{children:`可能会降低 Web 应用的 SEO 效果。因为渲染是在客户端浏览器进行的，
所以搜索引擎爬虫无法看到完整的 Web 应用内容，可能会导致搜索引擎排名降低，并且对用户的搜索体验造成影响。`}),`
`]}),`
`,e.jsx(n.p,{children:`但是 CSR 非常适合用来做一些动态和交互性强、并且不需要很好 SEO 的 Web 应用，
能达到比较彻底的前后端分离，对服务端依赖度不高。像管理后台这类的应用就很适合使用 CSR。`}),`
`,e.jsxs(n.h2,{id:"使用",children:[e.jsx(n.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,e.jsxs(n.p,{children:["servite 通过 ",e.jsx(n.a,{href:"/zh/guide/config#ssg",children:"csr"})," 配置项支持了 CSR。"]})]})}function d(r={}){const{wrapper:n}={...t(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{d as default,a as frontmatter,c as toc};
