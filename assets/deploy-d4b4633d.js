import{u as c,j as t,a as o,F as a}from"./index-a1360d88.js";const l=void 0;function i(n){const e=Object.assign({h1:"h1",a:"a",p:"p",code:"code"},c(),n.components),{Callout:r}=e;return r||d("Callout",!0),o(a,{children:[o(e.h1,{id:"部署",children:[t(e.a,{className:"header-anchor","aria-hidden":"true",tabIndex:"-1",href:"#部署",children:"#"}),"部署"]}),`
`,o(e.p,{children:[`servite 服务底层由 Nitro 进行驱动，所以部署也是跟 Nitro 应用一样，
具体请查看 `,t(e.a,{href:"https://nitro.unjs.io/deploy",children:"Nitro deploy"}),"。"]}),`
`,t(r,{type:"warning",children:o(e.p,{children:["部署前需要先执行生产环境的产物构建：",t(e.code,{children:"pnpm servite build"}),"。"]})})]})}function h(n={}){const{wrapper:e}=Object.assign({},c(),n.components);return e?t(e,Object.assign({},n,{children:t(i,n)})):i(n)}function d(n,e){throw new Error("Expected "+(e?"component":"object")+" `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}export{h as default,l as meta};
