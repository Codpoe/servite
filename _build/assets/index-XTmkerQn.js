import{r as o,j as e}from"./jsx-runtime-OjB1YB6s.js";import{c as p,D as f,f as g}from"./icons-DiXaHApO.js";import{L as x}from"./router-DOCjaTsd.js";import{d as b,g as j}from"./layout-OkWDDp9i.js";import"./index-DsYWWv1e.js";import"./preload-helper-BrvI3jIZ.js";import"./index-Crl2ozBJ.js";function u(s){return s.replace(/\/$/,"").replace("/#","#")}function C({className:s}){const[a,i]=o.useState(""),[c,n]=o.useState([]),d=o.useMemo(()=>b(async r=>{const t=await(await import(u("/servite")+"/pagefind/pagefind.js")).search(r);if(!t?.results?.length){n([]);return}const m=await Promise.all(t.results.slice(0,5).map(h=>h.data()));n(m)},400),[]);return o.useEffect(()=>{if(!a){n([]);return}d(a)},[a,d]),e.jsxs("div",{className:p("relative group",s),children:[e.jsx(f,{className:"pointer-events-none absolute top-1/2 left-2.5 -mt-2 w-4 h-4 text-muted-foreground"}),e.jsx(g,{className:"pl-8 pr-10 group-hover:border-foreground/50 group-focus-within:border-foreground/50 transition-colors","aria-label":"Search",autoComplete:"off",spellCheck:"false",placeholder:"Search",defaultValue:a,onChange:r=>{i(r.target.value)},onKeyDown:()=>{const r=j();setTimeout(()=>{window.scrollTo({top:r})})}}),e.jsxs("kbd",{className:"pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 h-5 select-none flex items-center gap-1 rounded border bg-secondary px-1.5 font-mono text-[10px] font-medium opacity-70 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity",children:[e.jsx("span",{className:"",children:"⌘"}),"K"]}),e.jsx("div",{className:p("hidden absolute top-full right-0 w-[500px] max-h-[600px] overflow-y-auto mt-2 px-2.5 pb-2.5 bg-secondary rounded-lg border border-border/60 shadow-lg dark:border-border text-sm",a&&"group-focus-within:block"),children:c.length?e.jsx("div",{className:"",children:c.map(r=>{const l=r.url.substring(0,r.url.length-r.raw_url.length);return e.jsxs("div",{children:[e.jsx("div",{className:"sticky top-0 font-medium text-primary py-2.5 bg-secondary/60 backdrop-blur-sm backdrop-saturate-200",children:r.meta.title}),e.jsx("div",{className:"space-y-2.5",children:r.sub_results.map(t=>e.jsxs(x,{className:"block px-3.5 py-2.5 bg-background text-foreground shadow-sm border border-transparent rounded-md hover:border-primary transition-all",to:u(t.url.startsWith(l)?t.url.slice(l.length):t.url),onClick:()=>i(""),children:[e.jsxs("div",{className:"font-medium mb-1.5",children:[t.anchor.element!=="h1"&&"# ",t.title]}),e.jsx("div",{dangerouslySetInnerHTML:{__html:t.excerpt}})]},t.url))}),e.jsx("div",{className:"h-4"})]},r.url)})}):e.jsx("div",{className:"flex justify-center pt-[30px] pb-5",children:"No result"})})]})}export{C as Search,C as default};