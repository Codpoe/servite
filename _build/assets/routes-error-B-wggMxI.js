import{j as s}from"./jsx-runtime-OjB1YB6s.js";import{_ as l}from"./nested-routes-CMQ4qAC8.js";import{u as i}from"./index-Crl2ozBJ.js";const c="/servite/_build/assets/error-display-D2xDtcrm.png",a={commitTime:1728711056},h=[{id:"路由错误展示",text:"路由错误展示",depth:1},{id:"错误的冒泡",text:"错误的冒泡",depth:2}];function n(r){const e={code:"code",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...i(),...r.components};return s.jsxs(s.Fragment,{children:[s.jsx(e.h1,{id:"路由错误展示",children:"路由错误展示"}),`
`,s.jsxs(e.p,{children:["当在 ",s.jsx(e.code,{children:"loader"}),"，",s.jsx(e.code,{children:"action"})," 或者组件 render 中抛出错误时，Servite 会捕获这些错误，然后展示在页面上："]}),`
`,s.jsx("img",{src:c,width:"500"}),`
`,s.jsxs(e.p,{children:["如果想自定义这个错误展示，可以在路由文件中导出 ",s.jsx(e.code,{children:"ErrorBoundary"})," 组件："]}),`
`,s.jsx(e.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:s.jsxs(e.code,{children:[s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// src/pages/page.tsx"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:" function"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" ErrorBoundary"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"() {"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"  return"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" <"}),s.jsx(e.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"div"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">🫨 啊噢，出错啦！</"}),s.jsx(e.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"div"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"}"})})]})}),`
`,s.jsx(e.h2,{id:"错误的冒泡",children:"错误的冒泡"}),`
`,s.jsxs(e.p,{children:["在多层嵌套的路由结构中，当底层的页面组件抛出错误时，错误会逐层“冒泡”，最终在最近的 ",s.jsx(e.code,{children:"ErrorBoundary"})," 里被捕获并展示。"]}),`
`,s.jsx(e.p,{children:"例如这样的路由结构："}),`
`,s.jsx(e.p,{children:s.jsx(e.img,{src:l})}),`
`,s.jsxs(e.p,{children:["当 ",s.jsx(e.code,{children:"<Settings />"})," 渲染发生错误时，会先寻找 ",s.jsx(e.code,{children:"/dashboard/settings/page.tsx"})," 里导出的 ",s.jsx(e.code,{children:"ErrorBoundary"})," 组件，"]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:["如果找到了，则会使用该组件来渲染错误信息，至于 ",s.jsx(e.code,{children:"<App />"})," 和 ",s.jsx(e.code,{children:"<Dashboard />"})," 则会照常渲染。"]}),`
`,s.jsxs(e.li,{children:["如果没找到，则错误会继续往上冒泡，直到被 Servite 的顶层默认 ",s.jsx(e.code,{children:"ErrorBoundary"})," 所捕获。"]}),`
`]})]})}function x(r={}){const{wrapper:e}={...i(),...r.components};return e?s.jsx(e,{...r,children:s.jsx(n,{...r})}):n(r)}export{x as default,a as frontmatter,h as toc};
