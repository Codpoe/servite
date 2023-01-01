import{u as d,j as n,a as r,F as s}from"./index-34016108.js";const h=void 0,l=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2}];function a(t){const e=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",strong:"strong"},d(),t.components),{Callout:i}=e;return i||c("Callout",!0),r(s,{children:[r(e.h1,{id:"ssg---静态站点生成",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#ssg---静态站点生成",children:"#"}),"SSG - 静态站点生成"]}),`
`,r(e.h2,{id:"介绍",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,n(e.p,{children:`SSG（Static Site Generation 静态站点生成）是指在构建时生成静态页面，并在运行时直接展示这些静态页面。
这与 SSR（服务器端渲染）的主要区别在于，SSG 在运行时不需要调用服务器来渲染页面，而是直接展示预先生成的静态页面。`}),`
`,n(e.p,{children:`相比 SSR，使用 SSG 的优点是可以进一步提高页面加载速度，并且节省服务器资源，因为页面已经是静态的，不需要调用服务器来渲染。
这在构建内容不经常更新的站点时特别有用，例如博客、文档等，你现在看到的 servite 文档就使用了 SSG 👀。`}),`
`,r(e.h2,{id:"使用",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,r(e.p,{children:["servite 通过 ",n(e.a,{href:"/zh/guide/config#ssg",children:"ssg"})," 配置项支持了全量 SSG 和部分页面 SSG。"]}),`
`,n(i,{type:"warning",children:r(e.p,{children:["SSG 是在",n(e.strong,{children:"构建时"}),`生成静态页面的，因此只有在重新构建时才能更新页面。
这意味着，如果需要频繁更新页面内容，则需要定期重新构建站点。`]})})]})}function S(t={}){const{wrapper:e}=Object.assign({},d(),t.components);return e?n(e,Object.assign({},t,{children:n(a,t)})):a(t)}function c(t,e){throw new Error("Expected "+(e?"component":"object")+" `"+t+"` to be defined: you likely forgot to import, pass, or provide it.")}export{S as default,h as meta,l as toc};
