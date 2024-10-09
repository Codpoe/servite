import{j as n}from"./jsx-runtime-OjB1YB6s.js";import{u as r}from"./index-Crl2ozBJ.js";const d={commitTime:1728478888},h=[{id:"csr---客户端渲染",text:"CSR - 客户端渲染",depth:1},{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2}];function i(t){const e={a:"a",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...r(),...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{id:"csr---客户端渲染",children:"CSR - 客户端渲染"}),`
`,n.jsx(e.h2,{id:"介绍",children:"介绍"}),`
`,n.jsx(e.p,{children:`CSR（Client-Side Rendering 客户端渲染）是指在浏览器中渲染 Web 应用。
与 SSR / SSG 相比，CSR 会有一些缺点：`}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:`首屏性能会差点，可能会影响 Web 应用的用户体验。
当客户端浏览器请求加载 Web 应用时，服务器会返回 Web 应用的 HTML 和 JavaScript 代码。
浏览器接收到这些代码后，会先把 HTML 渲染成页面，然后执行 JavaScript 代码进行动态渲染。
这样，用户在浏览器加载页面时，可能会先看到「白屏」，然后才会看到渲染完成的 Web 应用。`}),`
`,n.jsx(e.li,{children:`可能会降低 Web 应用的 SEO 效果。因为渲染是在客户端浏览器进行的，
所以搜索引擎爬虫无法看到完整的 Web 应用内容，可能会导致搜索引擎排名降低，并且对用户的搜索体验造成影响。`}),`
`]}),`
`,n.jsx(e.p,{children:`但是 CSR 非常适合用来做一些动态和交互性强、并且不需要很好 SEO 的 Web 应用，
能达到比较彻底的前后端分离，对服务端依赖度不高。像管理后台这类的应用就很适合使用 CSR。`}),`
`,n.jsx(e.h2,{id:"使用",children:"使用"}),`
`,n.jsxs(e.p,{children:["参考 ",n.jsx(e.a,{href:"/zh/guide/ssr#%E9%99%8D%E7%BA%A7",children:"SSR 降级"})]})]})}function o(t={}){const{wrapper:e}={...r(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(i,{...t})}):i(t)}export{o as default,d as frontmatter,h as toc};
