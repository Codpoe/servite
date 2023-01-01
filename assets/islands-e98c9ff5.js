import{u as c,j as n,a as d,F as i}from"./index-a1360d88.js";const s=void 0,h=[{id:"介绍",text:"介绍",depth:2},{id:"使用",text:"使用",depth:2},{id:"开启-ssg",text:"开启 SSG",depth:3},{id:"标记孤岛",text:"标记孤岛",depth:3},{id:"孤岛水合时机",text:"孤岛水合时机",depth:3}];function l(r){const e=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",strong:"strong",code:"code",h3:"h3",pre:"pre",span:"span",ul:"ul",li:"li"},c(),r.components);return d(i,{children:[d(e.h1,{id:"islands---孤岛架构",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#islands---孤岛架构",children:"#"}),"islands - 孤岛架构"]}),`
`,d(e.h2,{id:"介绍",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#介绍",children:"#"}),"介绍"]}),`
`,d(e.p,{children:["Islands Architecture（孤岛架构）的概念最初在 2019 年被 ",n(e.a,{href:"https://twitter.com/ksylor",children:"Katie Sylor-Miller"}),` 提出，
然后在 2020 年被 Preact 作者 Jason Miller 在`,n(e.a,{href:"https://jasonformat.com/islands-architecture/",children:"一篇文章"}),`中进行了推广。
简单来说，孤岛架构将我们的 Web 应用划分为静态和动态部分。其中的`,n(e.strong,{children:"动态孤岛"}),"可以独立进行水合，以实现它的交互能力。"]}),`
`,d(e.p,{children:[`servite 实现了 SSG 时的孤岛架构能力。相比单纯的 SSG，孤岛架构更进一步地提高了应用性能，
因为它只需对部分孤岛组件进行水合，也就只需下载部分组件的脚本代码，甚至能做到 `,n(e.code,{children:"0 JS"}),`。
你现在看到的 servite 文档就使用了 SSG + 孤岛架构 👀。`]}),`
`,d(e.h2,{id:"使用",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#使用",children:"#"}),"使用"]}),`
`,d(e.h3,{id:"开启-ssg",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#开启-ssg",children:"#"}),"开启 SSG"]}),`
`,d(e.p,{children:["再次，servite 的孤岛架构能力依赖于 SSG，所以需要先设置 ",n(e.code,{children:"ssg: true"}),`，
或者对那些需要使用孤岛架构的页面开启 SSG，例如假设只有 `,n(e.code,{children:"/guide"})," 要用孤岛架构，则设置：",n(e.code,{children:"ssg: ['/guide']"}),"。"]}),`
`,d(e.h3,{id:"标记孤岛",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#标记孤岛",children:"#"}),"标记孤岛"]}),`
`,n(e.p,{children:`请把你的整个 Web 应用想象成一片静态的汪洋大海，然后从中找出需要交互能力的组件，即动态的孤岛，
接着对这些孤岛进行标记。例如当前你看到的 servite 文档里，整个站点基本都是静态的，而右上角的切换主题按钮由于需要响应用户点击事件进行切换主题，
它就可以被认为是一个孤岛。`}),`
`,d(e.p,{children:["我们在代码里可以使用双下划线开头的 ",n(e.code,{children:"__island"})," 属性来把这个组件标记为孤岛组件："]}),`
`,n(e.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(e.code,{children:d(e.span,{className:"line",children:[n(e.span,{style:{color:"#CF222E"},children:"<"}),n(e.span,{style:{color:"#24292F"},children:"ThemeModeSwitch __island"}),n(e.span,{style:{color:"#CF222E"},children:"="}),n(e.span,{style:{color:"#0A3069"},children:'"load"'}),n(e.span,{style:{color:"#24292F"},children:" "}),n(e.span,{style:{color:"#CF222E"},children:"/>"})]})})}),n(e.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(e.code,{children:d(e.span,{className:"line",children:[n(e.span,{style:{color:"#FF7B72"},children:"<"}),n(e.span,{style:{color:"#C9D1D9"},children:"ThemeModeSwitch __island"}),n(e.span,{style:{color:"#FF7B72"},children:"="}),n(e.span,{style:{color:"#A5D6FF"},children:'"load"'}),n(e.span,{style:{color:"#C9D1D9"},children:" "}),n(e.span,{style:{color:"#FF7B72"},children:"/>"})]})})}),`
`,n(e.p,{children:"这样当页面加载时只会下载这一个组件的代码，其他组件直出 HTML。"}),`
`,d(e.h3,{id:"孤岛水合时机",children:[n(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#孤岛水合时机",children:"#"}),"孤岛水合时机"]}),`
`,d(e.p,{children:["上面 ",n(e.code,{children:'__island="load"'})," 的 ",n(e.code,{children:"load"}),` 表示在页面加载时立即水合该组件，
除此之外 servite 还支持了其他的水合时机：`]}),`
`,d(e.ul,{children:[`
`,d(e.li,{children:[n(e.code,{children:'__island="idle"'}),` 表示在浏览器空闲时才下载并水合该组件。
内部的实现使用了浏览器的 requestIdleCallback 方法。`]}),`
`,d(e.li,{children:[n(e.code,{children:'__island="visible"'})," 表示在组件可见时才下载并水合。内部的实现使用了 IntersectionObserver。"]}),`
`,d(e.li,{children:[n(e.code,{children:'__island="media" __islandOpts="(max-width: 600px)"'})," 表示当浏览器宽度 ≤ 600px 时才下载并水合该组件。"]}),`
`]})]})}function t(r={}){const{wrapper:e}=Object.assign({},c(),r.components);return e?n(e,Object.assign({},r,{children:n(l,r)})):l(r)}export{t as default,s as meta,h as toc};
