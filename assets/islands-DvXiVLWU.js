import{u as r,j as e}from"./index-59-5He-J.js";const i={commitTime:1712219292},c=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2},{id:"开启-ssg-和-islands",text:"开启 SSG 和 islands",depth:3},{id:"标记孤岛",text:"标记孤岛",depth:3},{id:"孤岛水合时机",text:"孤岛水合时机",depth:3}];function d(n){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsxs(s.h1,{id:"islands---孤岛架构",children:[e.jsx(s.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#islands---孤岛架构",children:"#"}),"islands - 孤岛架构"]}),`
`,e.jsxs(s.h2,{id:"介绍",children:[e.jsx(s.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,e.jsxs(s.p,{children:["Islands Architecture（孤岛架构）的概念最初在 2019 年被 ",e.jsx(s.a,{href:"https://twitter.com/ksylor",children:"Katie Sylor-Miller"}),` 提出，
然后在 2020 年被 Preact 作者 Jason Miller 在`,e.jsx(s.a,{href:"https://jasonformat.com/islands-architecture/",children:"一篇文章"}),`中进行了推广。
简单来说，孤岛架构将我们的 Web 应用划分为静态和动态部分。其中的`,e.jsx(s.strong,{children:"动态孤岛"}),"可以独立进行水合，以实现它的交互能力。"]}),`
`,e.jsxs(s.p,{children:[`servite 实现了 SSG 时的孤岛架构能力。相比单纯的 SSG，孤岛架构更进一步地提高了应用性能，
因为它只需对部分孤岛组件进行水合，也就只需下载部分组件的脚本代码，甚至能做到 `,e.jsx(s.code,{children:"0 JS"}),`。
你现在看到的 servite 文档就使用了 SSG + 孤岛架构 👀。`]}),`
`,e.jsxs(s.h2,{id:"使用",children:[e.jsx(s.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,e.jsxs(s.h3,{id:"开启-ssg-和-islands",children:[e.jsx(s.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#开启-ssg-和-islands",children:"#"}),"开启 SSG 和 islands"]}),`
`,e.jsxs(s.p,{children:["再次，servite 的孤岛架构能力依赖于 SSG，所以需要先设置 ",e.jsx(s.code,{children:"ssg: true"}),`，
或者对那些需要使用孤岛架构的页面开启 SSG，例如假设只有 `,e.jsx(s.code,{children:"/guide"})," 要用孤岛架构，则设置：",e.jsx(s.code,{children:"ssg: ['/guide']"}),"。"]}),`
`,e.jsxs(s.p,{children:["然后设置 ",e.jsx(s.code,{children:"islands: true"})," 即可开启孤岛的解析和渲染。"]}),`
`,e.jsxs(s.h3,{id:"标记孤岛",children:[e.jsx(s.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#标记孤岛",children:"#"}),"标记孤岛"]}),`
`,e.jsx(s.p,{children:`请把你的整个 Web 应用想象成一片静态的汪洋大海，然后从中找出需要交互能力的组件，即动态的孤岛，
接着对这些孤岛进行标记。例如当前你看到的 servite 文档里，整个站点基本都是静态的，而右上角的切换主题按钮由于需要响应用户点击事件进行切换主题，
它就可以被认为是一个孤岛。`}),`
`,e.jsxs(s.p,{children:["我们在代码里可以使用双下划线开头的 ",e.jsx(s.code,{children:"__island"})," 属性来把这个组件标记为孤岛组件："]}),`
`,e.jsx(s.pre,{className:"code-theme-light",style:{backgroundColor:'#f6f8fa" tabindex="0'},children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49"},children:"<"}),e.jsx(s.span,{style:{color:"#24292E"},children:"ThemeModeSwitch __island"}),e.jsx(s.span,{style:{color:"#D73A49"},children:"="}),e.jsx(s.span,{style:{color:"#032F62"},children:'"load"'}),e.jsx(s.span,{style:{color:"#24292E"},children:" "}),e.jsx(s.span,{style:{color:"#D73A49"},children:"/>"})]})})}),e.jsx(s.pre,{className:"code-theme-dark",style:{backgroundColor:'#161b22" tabindex="0'},children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#F97583"},children:"<"}),e.jsx(s.span,{style:{color:"#E1E4E8"},children:"ThemeModeSwitch __island"}),e.jsx(s.span,{style:{color:"#F97583"},children:"="}),e.jsx(s.span,{style:{color:"#9ECBFF"},children:'"load"'}),e.jsx(s.span,{style:{color:"#E1E4E8"},children:" "}),e.jsx(s.span,{style:{color:"#F97583"},children:"/>"})]})})}),`
`,e.jsx(s.p,{children:"这样当页面加载时只会下载这一个组件的代码，其他组件直出 HTML。"}),`
`,e.jsxs(s.h3,{id:"孤岛水合时机",children:[e.jsx(s.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#孤岛水合时机",children:"#"}),"孤岛水合时机"]}),`
`,e.jsxs(s.p,{children:["上面 ",e.jsx(s.code,{children:'__island="load"'})," 的 ",e.jsx(s.code,{children:"load"}),` 表示在页面加载时立即水合该组件，
除此之外 servite 还支持了其他的水合时机：`]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:'__island="idle"'}),` 表示在浏览器空闲时才下载并水合该组件。
内部的实现使用了浏览器的 requestIdleCallback 方法。`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:'__island="visible"'})," 表示在组件可见时才下载并水合。内部的实现使用了 IntersectionObserver。"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:'__island="media" __islandOpts="(max-width: 600px)"'})," 表示当浏览器宽度 ≤ 600px 时才下载并水合该组件。"]}),`
`]})]})}function a(n={}){const{wrapper:s}={...r(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(d,{...n})}):d(n)}export{a as default,i as frontmatter,c as toc};
