import{R as x,r as i,j as b}from"./jsx-runtime-OjB1YB6s.js";import{e as v,f as C}from"./index-DsYWWv1e.js";const j=x.forwardRef(function({to:r,onClick:u,replace:a=!1,state:d,target:o,preventScrollReset:l,relative:c,unstable_viewTransition:h,...m},n){const t=i.useRef(),w=v(r,{relative:c}),k=C(r,{target:o,replace:a,state:d,preventScrollReset:l,relative:c,unstable_viewTransition:h});return i.useEffect(()=>{if(!t.current||window.matchMedia("(hover: hover)").matches)return;const e=new IntersectionObserver(p=>{for(const R of p)R.isIntersecting&&(e.disconnect(),(window.requestIdleCallback||(_=>setTimeout(_,100)))(()=>{f(r)}))});return e.observe(t.current),()=>{e.disconnect()}},[r]),b.jsx("a",{...m,ref:e=>{t.current=e,typeof n=="function"?n(e):n&&(n.current=e)},href:w,target:o,onMouseEnter:()=>f(r),onClick:e=>{u?.(e),e.defaultPrevented||k(e)}})});function f(s){return window.__servite_init_route_handles__?.(s)}export{j as L};
