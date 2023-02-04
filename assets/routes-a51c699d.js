import{u as a,j as e,a as n,F as i}from"./index-afe46c0f.js";const h=void 0,t=[{id:"页面路由",text:"页面路由",depth:2},{id:"api-路由",text:"API 路由",depth:2}];function r(s){const l=Object.assign({h1:"h1",a:"a",p:"p",ul:"ul",li:"li",h2:"h2",code:"code",pre:"pre",span:"span",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td"},a(),s.components),{Callout:c}=l;return c||o("Callout",!0),n(i,{children:[n(l.h1,{id:"路由",children:[e(l.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#路由",children:"#"}),"路由"]}),`
`,e(l.p,{children:"servite 使用约定式路由（文件系统路由），文件路径会被简单地映射为路由路径，这会使整个项目的路由变得非常直观。"}),`
`,e(l.p,{children:"由于 servite 同时支持写页面和 API 借口而，路由系统也就分成了两个部分："}),`
`,n(l.ul,{children:[`
`,e(l.li,{children:"页面路由"}),`
`,e(l.li,{children:"API 路由"}),`
`]}),`
`,n(l.h2,{id:"页面路由",children:[e(l.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#页面路由",children:"#"}),"页面路由"]}),`
`,n(l.p,{children:["servite 会收集 ",e(l.a,{href:"/zh/guide/config#pagesdirs",children:"pagesDirs"})," 指定目录下的文件作为页面："]}),`
`,n(l.ul,{children:[`
`,n(l.li,{children:[e(l.code,{children:"page.{js,jsx,ts,tsx}"})," 会作为普通页面组件"]}),`
`,n(l.li,{children:["以 ",e(l.code,{children:".md"})," 或 ",e(l.code,{children:".mdx"})," 结尾的文件也会被作为普通页面组件"]}),`
`,n(l.li,{children:[e(l.code,{children:"layout.{js,jsx,ts,tsx}"})," 会作为布局组件"]}),`
`]}),`
`,e(c,{type:"tip",children:n(l.ul,{children:[`
`,n(l.li,{children:["不管是 ",e(l.code,{children:".md"})," 还是 ",e(l.code,{children:".mdx"}),"，servite 都会统一使用 MDX 来解析 Markdown 文件内容。"]}),`
`,n(l.li,{children:["如果是 ",e(l.code,{children:".js"}),"、",e(l.code,{children:".jsx"}),"、",e(l.code,{children:".ts"}),"、",e(l.code,{children:".tsx"})," 页面文件，这些文件模块需要默认导出一个组件。"]}),`
`]})}),`
`,e(l.p,{children:"举个例子，假设你的项目 src/pages 目录有如下文件结构："}),`
`,e(l.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(l.code,{children:[e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"src/pages"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  ├─ dashboard"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  ├─ analytics"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  │  └─ page.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  │"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  ├─ settings"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  │  └─ page.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  │"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │  └─ layout.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  │"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  ├─ layout.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  └─ page.tsx"})})]})}),e(l.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(l.code,{children:[e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"src/pages"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  ├─ dashboard"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  ├─ analytics"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  │  └─ page.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  │"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  ├─ settings"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  │  └─ page.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  │"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │  └─ layout.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  │"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  ├─ layout.tsx"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  └─ page.tsx"})})]})}),`
`,e(l.p,{children:"实际得到的路由映射是："}),`
`,n(l.table,{children:[e(l.thead,{children:n(l.tr,{children:[e(l.th,{children:"文件路径"}),e(l.th,{children:"路由路径"}),e(l.th,{children:"是否布局组件"})]})}),n(l.tbody,{children:[n(l.tr,{children:[e(l.td,{children:e(l.code,{children:"/layout.tsx"})}),e(l.td,{children:e(l.code,{children:"/*"})}),e(l.td,{children:"是"})]}),n(l.tr,{children:[e(l.td,{children:e(l.code,{children:"/page.tsx"})}),e(l.td,{children:e(l.code,{children:"/"})}),e(l.td,{children:"否"})]}),n(l.tr,{children:[e(l.td,{children:e(l.code,{children:"/dashboard/layout.tsx"})}),e(l.td,{children:e(l.code,{children:"/dashboard/*"})}),e(l.td,{children:"是"})]}),n(l.tr,{children:[e(l.td,{children:e(l.code,{children:"/dashboard/analytics/page.tsx"})}),e(l.td,{children:e(l.code,{children:"/dashboard/analytics"})}),e(l.td,{children:"否"})]}),n(l.tr,{children:[e(l.td,{children:e(l.code,{children:"/dashboard/settings/page.tsx"})}),e(l.td,{children:e(l.code,{children:"/dashboard/settings"})}),e(l.td,{children:"否"})]})]})]}),`
`,e(l.p,{children:"对应的 React Router 配置对象类似于："}),`
`,e(l.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(l.code,{children:[n(l.span,{className:"line",children:[e(l.span,{style:{color:"#CF222E"},children:"const"}),e(l.span,{style:{color:"#24292F"},children:" "}),e(l.span,{style:{color:"#0550AE"},children:"routes"}),e(l.span,{style:{color:"#24292F"},children:" "}),e(l.span,{style:{color:"#CF222E"},children:"="}),e(l.span,{style:{color:"#24292F"},children:" ["})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"    path: "}),e(l.span,{style:{color:"#0A3069"},children:"'/*'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"    element: <"}),e(l.span,{style:{color:"#116329"},children:"Layout"}),e(l.span,{style:{color:"#24292F"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"    children: ["})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"      {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"        path: "}),e(l.span,{style:{color:"#0A3069"},children:"'/'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"        element: <"}),e(l.span,{style:{color:"#116329"},children:"Index"}),e(l.span,{style:{color:"#24292F"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"      },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"      {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"        path: "}),e(l.span,{style:{color:"#0A3069"},children:"'/dashboard/*'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"        element: <"}),e(l.span,{style:{color:"#116329"},children:"DashboardLayout"}),e(l.span,{style:{color:"#24292F"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"        children: ["})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"          {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"            path: "}),e(l.span,{style:{color:"#0A3069"},children:"'/dashboard/analytics'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"            element: <"}),e(l.span,{style:{color:"#116329"},children:"Analytics"}),e(l.span,{style:{color:"#24292F"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"          },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"          {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"            path: "}),e(l.span,{style:{color:"#0A3069"},children:"'/dashboard/settings'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"            element: <"}),e(l.span,{style:{color:"#116329"},children:"Settings"}),e(l.span,{style:{color:"#24292F"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"          },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"        ],"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"      },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"    ],"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"];"})})]})}),e(l.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(l.code,{children:[n(l.span,{className:"line",children:[e(l.span,{style:{color:"#FF7B72"},children:"const"}),e(l.span,{style:{color:"#C9D1D9"},children:" "}),e(l.span,{style:{color:"#79C0FF"},children:"routes"}),e(l.span,{style:{color:"#C9D1D9"},children:" "}),e(l.span,{style:{color:"#FF7B72"},children:"="}),e(l.span,{style:{color:"#C9D1D9"},children:" ["})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"    path: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'/*'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"    element: <"}),e(l.span,{style:{color:"#7EE787"},children:"Layout"}),e(l.span,{style:{color:"#C9D1D9"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"    children: ["})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"      {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"        path: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'/'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"        element: <"}),e(l.span,{style:{color:"#7EE787"},children:"Index"}),e(l.span,{style:{color:"#C9D1D9"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"      },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"      {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"        path: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'/dashboard/*'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"        element: <"}),e(l.span,{style:{color:"#7EE787"},children:"DashboardLayout"}),e(l.span,{style:{color:"#C9D1D9"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"        children: ["})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"          {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"            path: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'/dashboard/analytics'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"            element: <"}),e(l.span,{style:{color:"#7EE787"},children:"Analytics"}),e(l.span,{style:{color:"#C9D1D9"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"          },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"          {"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"            path: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'/dashboard/settings'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"            element: <"}),e(l.span,{style:{color:"#7EE787"},children:"Settings"}),e(l.span,{style:{color:"#C9D1D9"},children:" />,"})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"          },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"        ],"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"      },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"    ],"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  },"})}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"];"})})]})}),`
`,n(l.h2,{id:"api-路由",children:[e(l.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#api-路由",children:"#"}),"API 路由"]}),`
`,n(l.p,{children:["servite 的 API 功能是由 Nitro 驱动的，完整的 API 路由文档请查看 ",e(l.a,{href:"https://nitro.unjs.io/guide/introduction/routing",children:"Nitro Route Handling"}),"。"]}),`
`,e(l.p,{children:"举个例子："}),`
`,n(l.p,{children:["文件 ",e(l.code,{children:"<root>/src/server/api/todo.get.ts"})," 有如下内容："]}),`
`,e(l.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(l.code,{children:[n(l.span,{className:"line",children:[e(l.span,{style:{color:"#CF222E"},children:"import"}),e(l.span,{style:{color:"#24292F"},children:" { eventHandler } "}),e(l.span,{style:{color:"#CF222E"},children:"from"}),e(l.span,{style:{color:"#24292F"},children:" "}),e(l.span,{style:{color:"#0A3069"},children:"'servite/server'"}),e(l.span,{style:{color:"#24292F"},children:";"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#CF222E"},children:"export"}),e(l.span,{style:{color:"#953800"},children:" "}),e(l.span,{style:{color:"#CF222E"},children:"default"}),e(l.span,{style:{color:"#953800"},children:" "}),e(l.span,{style:{color:"#8250DF"},children:"eventHandler"}),e(l.span,{style:{color:"#953800"},children:"("}),e(l.span,{style:{color:"#CF222E"},children:"async"}),e(l.span,{style:{color:"#953800"},children:" event "}),e(l.span,{style:{color:"#CF222E"},children:"=>"}),e(l.span,{style:{color:"#953800"},children:" "}),e(l.span,{style:{color:"#24292F"},children:"{"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"  "}),e(l.span,{style:{color:"#6E7781"},children:"// ..."})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"  "}),e(l.span,{style:{color:"#CF222E"},children:"return"}),e(l.span,{style:{color:"#24292F"},children:" {"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"    code: "}),e(l.span,{style:{color:"#0550AE"},children:"0"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"    msg: "}),e(l.span,{style:{color:"#0A3069"},children:"'ok'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"    data: "}),e(l.span,{style:{color:"#0A3069"},children:"'This is ok'"}),e(l.span,{style:{color:"#24292F"},children:","})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#24292F"},children:"  };"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#24292F"},children:"}"}),e(l.span,{style:{color:"#953800"},children:")"}),e(l.span,{style:{color:"#24292F"},children:";"})]})]})}),e(l.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(l.code,{children:[n(l.span,{className:"line",children:[e(l.span,{style:{color:"#FF7B72"},children:"import"}),e(l.span,{style:{color:"#C9D1D9"},children:" { eventHandler } "}),e(l.span,{style:{color:"#FF7B72"},children:"from"}),e(l.span,{style:{color:"#C9D1D9"},children:" "}),e(l.span,{style:{color:"#A5D6FF"},children:"'servite/server'"}),e(l.span,{style:{color:"#C9D1D9"},children:";"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#FF7B72"},children:"export"}),e(l.span,{style:{color:"#FFA657"},children:" "}),e(l.span,{style:{color:"#FF7B72"},children:"default"}),e(l.span,{style:{color:"#FFA657"},children:" "}),e(l.span,{style:{color:"#D2A8FF"},children:"eventHandler"}),e(l.span,{style:{color:"#FFA657"},children:"("}),e(l.span,{style:{color:"#FF7B72"},children:"async"}),e(l.span,{style:{color:"#FFA657"},children:" event "}),e(l.span,{style:{color:"#FF7B72"},children:"=>"}),e(l.span,{style:{color:"#FFA657"},children:" "}),e(l.span,{style:{color:"#C9D1D9"},children:"{"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"  "}),e(l.span,{style:{color:"#8B949E"},children:"// ..."})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"  "}),e(l.span,{style:{color:"#FF7B72"},children:"return"}),e(l.span,{style:{color:"#C9D1D9"},children:" {"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"    code: "}),e(l.span,{style:{color:"#79C0FF"},children:"0"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"    msg: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'ok'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"    data: "}),e(l.span,{style:{color:"#A5D6FF"},children:"'This is ok'"}),e(l.span,{style:{color:"#C9D1D9"},children:","})]}),`
`,e(l.span,{className:"line",children:e(l.span,{style:{color:"#C9D1D9"},children:"  };"})}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#C9D1D9"},children:"}"}),e(l.span,{style:{color:"#FFA657"},children:")"}),e(l.span,{style:{color:"#C9D1D9"},children:";"})]})]})}),`
`,n(l.p,{children:["由此你就得到了一个 ",e(l.code,{children:"GET /api/todo"})," 的 HTTP 接口，这里面有几个点："]}),`
`,n(l.ul,{children:[`
`,n(l.li,{children:["文件路径会直观地映射为接口请求路径：",e(l.code,{children:"/api/todo"})]}),`
`,n(l.li,{children:["文件名 ",e(l.code,{children:"todo.get.ts"})," 中的 ",e(l.code,{children:"get"})," 会被映射为 HTTP GET 方法。同理，你可以这么定义一个 POST 请求：",e(l.code,{children:"todo.post.ts"})]}),`
`,n(l.li,{children:["需要从 ",e(l.code,{children:"servite/server"})," 导出 ",e(l.code,{children:"eventHandler"})," 方法来定义请求处理器"]}),`
`]}),`
`,n(l.p,{children:["定义完接口后，在前端就可以通过原生 ",e(l.code,{children:"fetch"})," 或 ",e(l.code,{children:"axios"}),` 等请求库来调用此接口。
而为了便于快速开发，Servite 内置了 `,e(l.a,{href:"https://github.com/unjs/ofetch",children:"ofetch"})," 请求库，你可以通过 ",e(l.code,{children:"servite/client"})," 导入 ",e(l.code,{children:"ofetch"})," 的相关方法："]}),`
`,e(l.pre,{className:"code-theme-light",style:{backgroundColor:"#f6f8fa"},children:n(l.code,{children:[n(l.span,{className:"line",children:[e(l.span,{style:{color:"#CF222E"},children:"import"}),e(l.span,{style:{color:"#24292F"},children:" { ofetch } "}),e(l.span,{style:{color:"#CF222E"},children:"from"}),e(l.span,{style:{color:"#24292F"},children:" "}),e(l.span,{style:{color:"#0A3069"},children:"'servite/client'"}),e(l.span,{style:{color:"#24292F"},children:";"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#8250DF"},children:"ofetch"}),e(l.span,{style:{color:"#24292F"},children:"("}),e(l.span,{style:{color:"#0A3069"},children:"'/api/todo'"}),e(l.span,{style:{color:"#24292F"},children:");"})]})]})}),e(l.pre,{className:"code-theme-dark",style:{backgroundColor:"#161b22"},children:n(l.code,{children:[n(l.span,{className:"line",children:[e(l.span,{style:{color:"#FF7B72"},children:"import"}),e(l.span,{style:{color:"#C9D1D9"},children:" { ofetch } "}),e(l.span,{style:{color:"#FF7B72"},children:"from"}),e(l.span,{style:{color:"#C9D1D9"},children:" "}),e(l.span,{style:{color:"#A5D6FF"},children:"'servite/client'"}),e(l.span,{style:{color:"#C9D1D9"},children:";"})]}),`
`,n(l.span,{className:"line",children:[e(l.span,{style:{color:"#D2A8FF"},children:"ofetch"}),e(l.span,{style:{color:"#C9D1D9"},children:"("}),e(l.span,{style:{color:"#A5D6FF"},children:"'/api/todo'"}),e(l.span,{style:{color:"#C9D1D9"},children:");"})]})]})}),`
`,e(c,{type:"tip",title:"进阶",children:n(l.p,{children:["Servite 支持",e(l.a,{href:"/zh/guide/integrate-api-call",children:"一体化 API 调用"}),"，能提供更好的开发体验。"]})})]})}function p(s={}){const{wrapper:l}=Object.assign({},a(),s.components);return l?e(l,Object.assign({},s,{children:e(r,s)})):r(s)}function o(s,l){throw new Error("Expected "+(l?"component":"object")+" `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}export{p as default,h as meta,t as toc};
