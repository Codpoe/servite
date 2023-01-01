import{u as a,j as n,a as l,F as d}from"./index-a1360d88.js";const o=void 0,h=[{id:"1-快速搭建项目",text:"1. 快速搭建项目",depth:2},{id:"2-启动本地开发服务器",text:"2. 启动本地开发服务器",depth:2},{id:"3-构建生产环境产物",text:"3. 构建生产环境产物",depth:2},{id:"4-本地预览",text:"4. 本地预览",depth:2}];function s(c){const e=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",pre:"pre",span:"span"},a(),c.components),{Callout:r}=e;return r||i("Callout",!0),l(d,{children:[l(e.h1,{id:"开始上手",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#开始上手",children:"#"}),"开始上手"]}),`
`,l(e.p,{children:[n(e.code,{children:"Servite"})," 是一个可用于 React SSR、SSG、CSR 的 Vite 插件，并且在开启 SSG 后支持使用 ",n(e.code,{children:"孤岛架构"})," 以获得更好的页面性能。"]}),`
`,l(r,{type:"info",children:[l(e.p,{children:["Servite 实现",n(e.code,{children:"孤岛架构"}),"的很多灵感来源于 ",n(e.a,{href:"https://astro.build",children:"Astro"})," 和 ",n(e.a,{href:"https://islandjs.dev",children:"Islands.js"}),`。
如果是想快速搭建静态文档站，推荐直接使用 Island.js，因为它有一个开箱即用的非常精美的文档主题。`]}),l(e.p,{children:[`其实使用 Servite 来搭建文档站也是完全可以的，但 Servite 没有自带文档主题，所以需要你从零开始写更多的组件、样式等，
当然，你也可以复制你眼前的这个 `,n(e.a,{href:"https://github.com/Codpoe/servite/tree/master/packages/docs",children:"Servite 文档项目"}),"，然后在此基础上进行修改。"]})]}),`
`,l(e.h2,{id:"1-快速搭建项目",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#1-快速搭建项目",children:"#"}),"1. 快速搭建项目"]}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:l(e.code,{children:[n(e.span,{className:"line",children:n(e.span,{style:{color:"#6E7781"},children:"# npm 6.x"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"npm create servite my-app --ts"})}),`
`,n(e.span,{className:"line"}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#6E7781"},children:"# npm 7+, extra double-dash is needed:"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"npm create servite -- my-app --ts"})}),`
`,n(e.span,{className:"line"}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#6E7781"},children:"# yarn"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"yarn create servite my-app --ts"})}),`
`,n(e.span,{className:"line"}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#6E7781"},children:"# pnpm（后续操作均以 pnpm 作为示例）"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"pnpm create servite my-app --ts"})})]})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:l(e.code,{children:[n(e.span,{className:"line",children:n(e.span,{style:{color:"#8B949E"},children:"# npm 6.x"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"npm create servite my-app --ts"})}),`
`,n(e.span,{className:"line"}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#8B949E"},children:"# npm 7+, extra double-dash is needed:"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"npm create servite -- my-app --ts"})}),`
`,n(e.span,{className:"line"}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#8B949E"},children:"# yarn"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"yarn create servite my-app --ts"})}),`
`,n(e.span,{className:"line"}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#8B949E"},children:"# pnpm（后续操作均以 pnpm 作为示例）"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"pnpm create servite my-app --ts"})})]})}),`
`,l(e.p,{children:["执行上面的命令会在目录 ",n(e.code,{children:"my-app"})," 里用 Vite 的 ",n(e.code,{children:"react-ts"})," 模板来初始化项目。你也可以把上面的 ",n(e.code,{children:"my-app"})," 替换成 ",n(e.code,{children:"."}),"，这样项目就会在当前目录进行初始化了。"]}),`
`,l(e.p,{children:["尽管我推荐新项目都是用 TypeScript，但如果你还是不想用的话，可以去掉上面命令里的 ",n(e.code,{children:"--ts"}),"，这样就会改为使用 Vite ",n(e.code,{children:"react"})," 模板来初始化项目了。"]}),`
`,l(e.h2,{id:"2-启动本地开发服务器",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#2-启动本地开发服务器",children:"#"}),"2. 启动本地开发服务器"]}),`
`,l(e.p,{children:["经过第一步后，可以 ",n(e.code,{children:"cd my-app"})," 进入项目目录，然后执行下面的命令安装依赖："]}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"pnpm i"})})})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"pnpm i"})})})}),`
`,n(e.p,{children:"通过如下命令启动 Vite 的 dev server："}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"pnpm dev"})})})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"pnpm dev"})})})}),`
`,l(e.p,{children:["这样 Vite 将在 ",n(e.a,{href:"http://127.0.0.1:5173/",children:"http://127.0.0.1:5173/"})," 启动开发服务。"]}),`
`,l(e.h2,{id:"3-构建生产环境产物",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#3-构建生产环境产物",children:"#"}),"3. 构建生产环境产物"]}),`
`,n(e.p,{children:"通过以下命令构建生产环境的产物："}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"pnpm build"})})})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"pnpm build"})})})}),`
`,l(e.p,{children:["默认情况下产物会被打包到 ",n(e.code,{children:"dist"}),` 目录。
其中的 `,n(e.code,{children:"dist/.output"})," 是 Nitro 的产物目录，你可以将这个目录直接部署到服务器上运行。"]}),`
`,l(e.h2,{id:"4-本地预览",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#4-本地预览",children:"#"}),"4. 本地预览"]}),`
`,n(e.p,{children:"在上面的生产构建命令运行完成后，控制台最后会输出一句提示："}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(e.code,{children:l(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292F"},children:"✔ You can preview this build using node dist/.output/server/index.mjs"}),n(e.span,{style:{color:"#0A3069"},children:"`"})]})})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(e.code,{children:l(e.span,{className:"line",children:[n(e.span,{style:{color:"#C9D1D9"},children:"✔ You can preview this build using node dist/.output/server/index.mjs"}),n(e.span,{style:{color:"#A5D6FF"},children:"`"})]})})}),`
`,n(e.p,{children:"所以你可以按照此提示，执行命令进行预览："}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292F"},children:"node dist/.output/server/index.mjs"})})})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(e.code,{children:n(e.span,{className:"line",children:n(e.span,{style:{color:"#C9D1D9"},children:"node dist/.output/server/index.mjs"})})})})]})}function p(c={}){const{wrapper:e}=Object.assign({},a(),c.components);return e?n(e,Object.assign({},c,{children:n(s,c)})):s(c)}function i(c,e){throw new Error("Expected "+(e?"component":"object")+" `"+c+"` to be defined: you likely forgot to import, pass, or provide it.")}export{p as default,o as meta,h as toc};
