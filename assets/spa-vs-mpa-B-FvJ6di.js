import{u as a,j as n}from"./index-BDl0G4IS.js";const r={commitTime:1712489739},t=[{id:"介绍",text:"介绍",depth:2},{id:"对比",text:"对比",depth:2},{id:"islands-孤岛架构",text:"Islands 孤岛架构",depth:2}];function i(s){const e={a:"a",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...a(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsxs(e.h1,{id:"spa-vs-mpa",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#spa-vs-mpa",children:"#"}),"SPA vs MPA"]}),`
`,n.jsxs(e.h2,{id:"介绍",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,n.jsx(e.p,{children:"Web 应用中的 SPA（Single Page Application）和 MPA（Multiple Page Application）是两种常用的应用架构。"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"SPA 指在整个 Web 应用只有一个 HTML 页面。在 SPA 应用中，所有的页面内容都是在客户端动态渲染，不需要刷新页面即可进行跳转。"}),`
`,n.jsx(e.li,{children:"MPA 指在 Web 应用中每个功能模块都对应一个 HTML 页面。在 MPA 应用中，每次跳转都会刷新页面，加载新的内容。传统的模板技术如 JSP 就属于 MPA 架构。"}),`
`]}),`
`,n.jsxs(e.h2,{id:"对比",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#对比",children:"#"}),"对比"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:`性能：SPA 需要先请求并执行客户端 JS 才能渲染出页面，而 MPA 直出 HTML，首屏性能更好。
但对于后续页面的跳转和加载，SPA 只需要加载新页面的部分组件，所以会更快。`}),`
`,n.jsx(e.li,{children:"用户体验：相比 MPA，SPA 可以更好地提高用户体验，因为 SPA 不需要刷新页面，用户在使用应用时操作会更加流畅。"}),`
`,n.jsx(e.li,{children:"SEO 优化：MPA 可能更适合 SEO 优化，因为 MPA 应用的每个页面都对应一个独立的 HTML 页面，可以直接被搜索引擎抓取。"}),`
`]}),`
`,n.jsx(e.p,{children:`SPA 和 MPA 并不是完全割裂的，两者也是可以部分融合的，扬长避短。
例如在服务端生成完整的 HTML，同时注入客户端所需要的 SPA 脚本。这样浏览器会拿到完整的 HTML，
然后执行客户端的脚本，进行 hydrate（水合），后续路由的跳转由 JS 来接管。
当下很多的框架都是采用这样的方案，比如 Next.js、Gatsby。其实 servite 的 SSR / SSG 也是这样的融合方案。`}),`
`,n.jsxs(e.h2,{id:"islands-孤岛架构",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#islands-孤岛架构",children:"#"}),"Islands 孤岛架构"]}),`
`,n.jsx(e.p,{children:`servite 在 SSG 的基础上实现了孤岛架构，能获得更好的页面加载性能，但这是一个彻底的 MPA，
也就是说进行页面跳转时都会刷新页面，加载完整的内容。`}),`
`,n.jsx(e.p,{children:"不管是 SPA、MPA，还是 Islands，都有其独特的地方，不能严格界定其适用场景，还需要根据应用的实际需求进行判断。"})]})}function h(s={}){const{wrapper:e}={...a(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{h as default,r as frontmatter,t as toc};
