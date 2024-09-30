import{j as i}from"./jsx-runtime-OjB1YB6s.js";import{u as n}from"./index-Crl2ozBJ.js";const o={commitTime:1727681315},h=[{id:"一体化-api-调用",text:"一体化 API 调用",depth:1},{id:"使用",text:"使用",depth:2},{id:"结合-typescript",text:"结合 Typescript",depth:3}];function e(l){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...n(),...l.components},{Callout:r}=s;return r||a("Callout"),i.jsxs(i.Fragment,{children:[i.jsx(s.h1,{id:"一体化-api-调用",children:"一体化 API 调用"}),`
`,i.jsx(s.p,{children:"Servite 支持一体化的 API 调用，意思就是可以在前端直接 import API 函数，调用时会自动转换成 HTTP 请求。这个方式有以下好处："}),`
`,i.jsxs(s.ul,{children:[`
`,i.jsx(s.li,{children:"更简洁、优雅的 API 调用方式，无需手动写接口 URL"}),`
`,i.jsx(s.li,{children:"更完善的 Typescript 类型提示。在前端侧可以直接感知接口的参数类型和响应类型"}),`
`,i.jsx(s.li,{children:"更好的开发体验"}),`
`]}),`
`,i.jsx(s.h2,{id:"使用",children:"使用"}),`
`,i.jsxs(s.p,{children:["在前面我们已经介绍过如何定义 ",i.jsx(s.a,{href:"/zh/guide/routes#api-%E8%B7%AF%E7%94%B1",children:"API 路由"}),"了，但想要实现",i.jsx(s.strong,{children:"一体化调用"}),"，你需要改为从 ",i.jsx(s.code,{children:"servite/server"})," 中导出 ",i.jsx(s.code,{children:"apiHandler"})," 方法来定义接口："]}),`
`,i.jsx(s.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:i.jsxs(s.code,{children:[i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// <root>/src/server/api/todo.get.ts"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" { "}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"apiHandler"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" } "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"from"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"servite/server"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" default"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" apiHandler"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"("}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"async"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" ("}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"args"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" event"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:") "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"=>"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  // ..."})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"  return"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    code"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#56B6C2"},children:" 0"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    msg"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"ok"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    data"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"This is ok"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  };"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"});"})})]})}),`
`,i.jsx(s.p,{children:"接着就可以在前端代码中直接 import 该文件来进行调用了："}),`
`,i.jsx(s.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:i.jsxs(s.code,{children:[i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// <root>/src/pages/page.tsx"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" { "}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"useState"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" useEffect"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" } "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"from"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"react"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" getTodo"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" from"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"../server/api/todo.get"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" default"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:" function"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" Page"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"() {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"  const"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" ["}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:"res"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:" setRes"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"] "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"="}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" useState"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"();"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"  useEffect"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"(() "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"=>"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    ("}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"async"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" () "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"=>"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"      // 此调用会被自动转换成发起请求：GET /api/todo"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"      const"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:" res"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" ="}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" await"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" getTodo"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"();"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"      setRes"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"("}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"res"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:");"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    })();"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  }"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" []);"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  // ..."})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"}"})})]})}),`
`,i.jsx(r,{type:"tip",children:i.jsxs(s.p,{children:["一体化 API 调用相关的配置项可以看",i.jsx(s.a,{href:"/zh/guide/config#api",children:"这里"}),"。"]})}),`
`,i.jsx(s.h3,{id:"结合-typescript",children:"结合 Typescript"}),`
`,i.jsx(s.p,{children:"结合 Typescript，定义好接口的入参类型和返回结果类型，能让一体化调用达到更好的开发体验："}),`
`,i.jsx(s.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:i.jsxs(s.code,{children:[i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// <root>/src/server/api/todo.get.ts"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" { "}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"apiHandler"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" } "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"from"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"servite/server"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:" enum"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:" Bar"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  Great"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  Cool"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"}"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// 定义入参类型"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:" interface"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:" Args"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  foo"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#E5C07B"},children:" string"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  bar"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:":"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:" Bar"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"}"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// 定义响应类型"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:" interface"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:" Result"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  code"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#E5C07B"},children:" number"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  msg"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#E5C07B"},children:" string"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"  data"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#E5C07B"},children:" string"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"}"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// 通过泛型来约束函数类型"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" default"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" apiHandler"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"<"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:"Args"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:" Result"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">("}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"async"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" ("}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"args"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:":"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:" Args"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" event"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:") "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"=>"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  // ..."})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"  return"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    code"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#56B6C2"},children:" 0"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    msg"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"ok"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    data"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"This is ok"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  };"})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"});"})})]})}),`
`,i.jsx(s.p,{children:"在前端 import 相关的类型："}),`
`,i.jsx(s.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:i.jsxs(s.code,{children:[i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"// <root>/src/pages/page.tsx"})}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" { "}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"useState"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" useEffect"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" } "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"from"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"react"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"import"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" getTodo"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" { "}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"Result"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:" Bar"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" } "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"from"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"../server/api/todo.get"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:";"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"export"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" default"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:" function"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" Page"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"() {"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  // 使用 Result 作为 useState 的泛型"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"  const"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" ["}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:"res"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:" setRes"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"] "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:"="}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" useState"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"<"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#E5C07B"},children:"Result"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">();"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"  useEffect"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"(() "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"=>"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    ("}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"async"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" () "}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"=>"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"      // 此调用会被自动转换成发起请求：GET /api/todo?foo=xxx&bar=0"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#61AFEF"},children:"      const"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:" res"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" ="}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" await"}),i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:" getTodo"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"({"})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"        foo"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:" '"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"xxx"}),i.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:"'"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"        bar"}),i.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),i.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#C6CCD7"},children:" Bar"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"."}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"Great"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"      });"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B57EDC"},children:"      setRes"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"("}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#C6CCD7"},children:"res"}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:");"})]}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    })();"})}),`
`,i.jsxs(s.span,{className:"line",children:[i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  }"}),i.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","}),i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" []);"})]}),`
`,i.jsx(s.span,{className:"line"}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  // ..."})}),`
`,i.jsx(s.span,{className:"line",children:i.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"}"})})]})})]})}function k(l={}){const{wrapper:s}={...n(),...l.components};return s?i.jsx(s,{...l,children:i.jsx(e,{...l})}):e(l)}function a(l,s){throw new Error("Expected component `"+l+"` to be defined: you likely forgot to import, pass, or provide it.")}export{k as default,o as frontmatter,h as toc};
