import{u as i,j as n}from"./index-BDl0G4IS.js";const o={commitTime:1712489739},h=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2}];function t(r){const e={a:"a",h1:"h1",h2:"h2",li:"li",p:"p",ul:"ul",...i(),...r.components},{Callout:s}=e;return s||d("Callout",!0),n.jsxs(n.Fragment,{children:[n.jsxs(e.h1,{id:"ssr---服务端渲染",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#ssr---服务端渲染",children:"#"}),"SSR - 服务端渲染"]}),`
`,n.jsxs(e.h2,{id:"介绍",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,n.jsx(e.p,{children:`SSR（Server-Side Rendering 服务端渲染）是一种在请求时在服务器上而不是在浏览器中渲染 Web 页面的技术，
这允许 Web 页面在服务器上呈现并作为静态 HTML 发送到客户端。SSR 有很多好处：`}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"提高性能并提供更好的用户体验。"}),`
`,n.jsx(e.li,{children:"改进 Web 应用的搜索引擎优化（SEO），因为内容已经在服务器上呈现，并且可以很容易地被搜索引擎索引。"}),`
`]}),`
`,n.jsxs(e.h2,{id:"使用",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,n.jsx(e.p,{children:"servite 已经默认开启了 SSR，无需额外配置。"}),`
`,n.jsxs(s,{type:"warning",children:[n.jsx(e.p,{children:"为了让渲染的内容在服务端和客户端保持一致，需要注意以下几点："}),n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:`在编写 class 组件时，避免在构造函数中执行任何副作用操作（如访问浏览器 API、发送网络请求等）。
这些操作只能在生命周期函数或事件回调中执行。`}),`
`,n.jsx(e.li,{children:"同理，在编写函数组件时，避免在函数体中执行任何副作用操作。这些操作只能在使用 hooks（如 useEffect）时执行。"}),`
`,n.jsx(e.li,{children:"在使用 hooks 时，需要确保它们在服务端渲染时不执行副作用操作。这通常需要检查组件的挂载状态。"}),`
`]})]})]})}function l(r={}){const{wrapper:e}={...i(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(t,{...r})}):t(r)}function d(r,e){throw new Error("Expected "+(e?"component":"object")+" `"+r+"` to be defined: you likely forgot to import, pass, or provide it.")}export{l as default,o as frontmatter,h as toc};
