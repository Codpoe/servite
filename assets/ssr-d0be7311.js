import{u as a,j as n,a as i,F as c}from"./index-34016108.js";const o=void 0,s=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2}];function d(r){const e=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",ul:"ul",li:"li"},a(),r.components),{Callout:t}=e;return t||h("Callout",!0),i(c,{children:[i(e.h1,{id:"ssr---服务端渲染",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#ssr---服务端渲染",children:"#"}),"SSR - 服务端渲染"]}),`
`,i(e.h2,{id:"介绍",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,n(e.p,{children:`SSR（Server-Side Rendering 服务端渲染）是一种在请求时在服务器上而不是在浏览器中渲染 Web 页面的技术，
这允许 Web 页面在服务器上呈现并作为静态 HTML 发送到客户端。SSR 有很多好处：`}),`
`,i(e.ul,{children:[`
`,n(e.li,{children:"提高性能并提供更好的用户体验。"}),`
`,n(e.li,{children:"改进 Web 应用的搜索引擎优化（SEO），因为内容已经在服务器上呈现，并且可以很容易地被搜索引擎索引。"}),`
`]}),`
`,i(e.h2,{id:"使用",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,n(e.p,{children:"servite 已经默认开启了 SSR，无需额外配置。"}),`
`,i(t,{type:"warning",children:[n(e.p,{children:"为了让渲染的内容在服务端和客户端保持一致，需要注意以下几点："}),i(e.ul,{children:[`
`,n(e.li,{children:`在编写 class 组件时，避免在构造函数中执行任何副作用操作（如访问浏览器 API、发送网络请求等）。
这些操作只能在生命周期函数或事件回调中执行。`}),`
`,n(e.li,{children:"同理，在编写函数组件时，避免在函数体中执行任何副作用操作。这些操作只能在使用 hooks（如 useEffect）时执行。"}),`
`,n(e.li,{children:"在使用 hooks 时，需要确保它们在服务端渲染时不执行副作用操作。这通常需要检查组件的挂载状态。"}),`
`]})]})]})}function u(r={}){const{wrapper:e}=Object.assign({},a(),r.components);return e?n(e,Object.assign({},r,{children:n(d,r)})):d(r)}function h(r,e){throw new Error("Expected "+(e?"component":"object")+" `"+r+"` to be defined: you likely forgot to import, pass, or provide it.")}export{u as default,o as meta,s as toc};
