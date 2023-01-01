import{R as O,r as c,a as b,_ as v}from"./islands-7bd2f825.js";import{u as k,j as f,F as y,i as R,a as o,W as I,L as _}from"./Link-9f02b2a1.js";import{r as D,A as l,L as A,I as P}from"./utils-e0103c60.js";import{u as F}from"./context-5d56a514.js";import{S as E,C as T}from"./index-f1ca74f5.js";function K(r){var a=r.target,n=a.tagName;return a.isContentEditable||n==="INPUT"||n==="SELECT"||n==="TEXTAREA"}function $(r){var a=r.isOpen,n=r.onOpen,m=r.onClose,i=r.onInput,s=r.searchButtonRef;O.useEffect(function(){function u(t){function C(){document.body.classList.contains("DocSearch--active")||n()}(t.keyCode===27&&a||t.key.toLowerCase()==="k"&&(t.metaKey||t.ctrlKey)||!K(t)&&t.key==="/"&&!a)&&(t.preventDefault(),a?m():document.body.classList.contains("DocSearch--active")||C()),s&&s.current===document.activeElement&&i&&/[a-zA-Z0-9]/.test(String.fromCharCode(t.keyCode))&&i(t)}return window.addEventListener("keydown",u),function(){window.removeEventListener("keydown",u)}},[a,n,m,i,s])}let x=null;async function h(){x||([{DocSearchModal:x}]=await Promise.all([v(()=>import("./modal-0ea4a8b6.js"),["assets/modal-0ea4a8b6.js","assets/islands-7bd2f825.js"]),v(()=>import("./index-4ed993c7.js"),["assets/index-4ed993c7.js","assets/index-b08bff0d.css"])]))}function j({hit:r,children:a}){return o(_,{to:r.url,children:a})}function W({iconOnly:r}){var S,g;const a=k(),{currentLocale:n}=F(),m=c.exports.useRef(null),[i,s]=c.exports.useState(!1),u=c.exports.useCallback(async()=>{await h(),s(!0)},[s]),t=c.exports.useCallback(()=>{s(!1)},[s]),C=c.exports.useCallback(e=>e.map(d=>{const{pathname:p,hash:N}=new URL(d.url);return{...d,url:`${D("/servite/")}${p}${N}`}}),[]),L=c.exports.useRef({navigate({item:e}){e!=null&&e.url&&a(e.url)}}).current,w=c.exports.useMemo(()=>{var d,p;let e=((p=(d=l)==null?void 0:d.searchParameters)==null?void 0:p.facetFilters)||[];return e=typeof e=="string"?[e]:e,A.length>1?[`lang:${n.locale}`,...e]:e},[n]);return $({isOpen:i,onOpen:u,onClose:t}),!((S=l)!=null&&S.apiKey)||!((g=l)!=null&&g.indexName)?null:f(y,{children:[!R&&o(I,{children:o("link",{rel:"preconnect",href:`https://${l.appId}-dsn.algolia.net`,crossOrigin:""})}),o("button",{ref:m,className:"group flex justify-center items-center h-full ml-6","aria-label":"Search",onMouseOver:h,onTouchStart:h,onFocus:h,onClick:u,children:r?o("div",{className:"flex justify-center w-12",children:o(E,{className:"text-xl text-c-text-0 group-hover:text-c-brand transition-colors"})}):f(y,{children:[f("div",{className:"flex items-center space-x-1.5 mr-1.5 text-c-text-2 group-hover:text-c-text-0 transition-colors",children:[o(E,{className:"text-[15px]"}),o("span",{className:"text-[13px]",children:"Search"})]}),f("div",{className:"flex items-center h-4.5 px-0.5 border border-current rounded text-xs text-c-text-3 group-hover:text-c-brand transition-colors",children:[o(T,{}),"K"]})]})}),P&&i&&x&&b.exports.createPortal(o(x,{initialScrollY:window.scrollY,transformItems:C,hitComponent:j,navigator:L,onClose:t,...l,searchParameters:{...l.searchParameters,facetFilters:w}}),document.body)]})}export{W as Search};
