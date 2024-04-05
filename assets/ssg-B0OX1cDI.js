import{u as i,j as n}from"./index-DEfUcY5W.js";const d={commitTime:1712328050},c=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2}];function s(t){const e={a:"a",h1:"h1",h2:"h2",p:"p",strong:"strong",...i(),...t.components},{Callout:r}=e;return r||o("Callout",!0),n.jsxs(n.Fragment,{children:[n.jsxs(e.h1,{id:"ssg---静态站点生成",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#ssg---静态站点生成",children:"#"}),"SSG - 静态站点生成"]}),`
`,n.jsxs(e.h2,{id:"介绍",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,n.jsx(e.p,{children:`SSG（Static Site Generation 静态站点生成）是指在构建时生成静态页面，并在运行时直接展示这些静态页面。
这与 SSR（服务器端渲染）的主要区别在于，SSG 在运行时不需要调用服务器来渲染页面，而是直接展示预先生成的静态页面。`}),`
`,n.jsx(e.p,{children:`相比 SSR，使用 SSG 的优点是可以进一步提高页面加载速度，并且节省服务器资源，因为页面已经是静态的，不需要调用服务器来渲染。
这在构建内容不经常更新的站点时特别有用，例如博客、文档等，你现在看到的 servite 文档就使用了 SSG 👀。`}),`
`,n.jsxs(e.h2,{id:"使用",children:[n.jsx(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,n.jsxs(e.p,{children:["servite 通过 ",n.jsx(e.a,{href:"/zh/guide/config#ssg",children:"ssg"})," 配置项支持了全量 SSG 和部分页面 SSG。"]}),`
`,n.jsx(r,{type:"warning",children:n.jsxs(e.p,{children:["SSG 是在",n.jsx(e.strong,{children:"构建时"}),`生成静态页面的，因此只有在重新构建时才能更新页面。
这意味着，如果需要频繁更新页面内容，则需要定期重新构建站点。`]})})]})}function h(t={}){const{wrapper:e}={...i(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}function o(t,e){throw new Error("Expected "+(e?"component":"object")+" `"+t+"` to be defined: you likely forgot to import, pass, or provide it.")}export{h as default,d as frontmatter,c as toc};
