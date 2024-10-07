import{j as s}from"./jsx-runtime-OjB1YB6s.js";import{u as l}from"./index-Crl2ozBJ.js";const c={commitTime:1728317250},d=[{id:"服务中间件",text:"服务中间件",depth:1},{id:"执行顺序",text:"执行顺序",depth:2}];function n(i){const e={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",span:"span",...l(),...i.components};return s.jsxs(s.Fragment,{children:[s.jsx(e.h1,{id:"服务中间件",children:"服务中间件"}),`
`,s.jsxs(e.p,{children:["Servite 默认会把 ",s.jsx(e.code,{children:"src/server/middlewares/"})," 下的文件当做中间件。可以通过 ",s.jsx(e.code,{children:"defineMiddleware"})," 来定义中间件："]}),`
`,s.jsx(e.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:s.jsxs(e.code,{children:[s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" { "}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"defineMiddleware"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" } "}),s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"from"}),s.jsx(e.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),s.jsx(e.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"servite/runtime/server"}),s.jsx(e.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,s.jsx(e.span,{className:"line"}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" default"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" defineMiddleware"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"({"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"  async"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" onRequest"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"("}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"event"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:") {}"}),s.jsx(e.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"  async"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" onBeforeResponse"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"("}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"event"}),s.jsx(e.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" response"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:") {}"}),s.jsx(e.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"})"})})]})}),`
`,s.jsx(e.h2,{id:"执行顺序",children:"执行顺序"}),`
`,s.jsxs(e.p,{children:[`中间件的执行顺序是由文件的顺序决定的，并且有点类似于 Koa 的洋葱模型：
一个请求到达服务器时，会首先经过从外向内的每一层中间件 `,s.jsx(e.code,{children:"onRequest"}),`，
之后再由内向外依次返回经过相同的中间件 `,s.jsx(e.code,{children:"onBeforeResponse"}),"。"]}),`
`,s.jsx(e.p,{children:"例如，文件目录结构如下所示："}),`
`,s.jsx(e.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:s.jsxs(e.code,{children:[s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"<"}),s.jsx(e.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"root"}),s.jsx(e.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:">"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"└─"}),s.jsx(e.span,{style:{color:"#2B5581","--shiki-dark":"#98C379"},children:" src"}),s.jsx(e.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"                # 源码目录"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"   └─"}),s.jsx(e.span,{style:{color:"#2B5581","--shiki-dark":"#98C379"},children:" server"}),s.jsx(e.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"          # 服务端源码目录"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"      └─"}),s.jsx(e.span,{style:{color:"#2B5581","--shiki-dark":"#98C379"},children:" middlewares"}),s.jsx(e.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  # 中间件目录"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"         ├─"}),s.jsx(e.span,{style:{color:"#2B5581","--shiki-dark":"#98C379"},children:" a.ts"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"         ├─"}),s.jsx(e.span,{style:{color:"#2B5581","--shiki-dark":"#98C379"},children:" b.ts"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"         └─"}),s.jsx(e.span,{style:{color:"#2B5581","--shiki-dark":"#98C379"},children:" c.ts"})]})]})}),`
`,s.jsx(e.p,{children:"那与之对应的中间件执行顺序是："}),`
`,s.jsx(e.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:s.jsxs(e.code,{children:[s.jsx(e.span,{className:"line",children:s.jsx(e.span,{children:"Request → a → b → c → Response"})}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{children:"          a ← b ← c ↩︎"})})]})}),`
`,s.jsxs(e.p,{children:["为了使得中间件的执行顺序更为可控，推荐给文件名添加数字前缀，例如：",s.jsx(e.code,{children:"0.name.ts"}),"，",s.jsx(e.code,{children:"1.name.ts"}),` 等。
但如果你有超过 10 个中间件，那么可以使用两位数字前缀，例如：`,s.jsx(e.code,{children:"00.name.ts"}),"，",s.jsx(e.code,{children:"01.name.ts"}),`，
这样能容纳 100 个中间件，已经完全足够了。`]})]})}function o(i={}){const{wrapper:e}={...l(),...i.components};return e?s.jsx(e,{...i,children:s.jsx(n,{...i})}):n(i)}export{o as default,c as frontmatter,d as toc};