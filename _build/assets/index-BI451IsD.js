import{j as r}from"./jsx-runtime-OjB1YB6s.js";import{c as a,L as d,x}from"./icons-DiXaHApO.js";import{L as p}from"./router-DOCjaTsd.js";function g({children:e,className:o}){return r.jsx("div",{className:a("grid w-full auto-rows-[22rem] grid-cols-3 gap-4",o),children:e})}function m({name:e,className:o,background:n,Icon:l,description:i,to:s,cta:t}){return r.jsxs("div",{className:a("group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl","bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]","transform-gpu dark:border dark:border-border dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",o),children:[r.jsx("div",{children:n}),r.jsxs("div",{className:"pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10",children:[r.jsx(l,{className:"h-12 w-12 origin-left transform-gpu text-foreground transition-all duration-300 ease-in-out group-hover:scale-75"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground dark:text-neutral-300",children:e}),r.jsx("p",{className:"max-w-lg text-foreground/50",children:i})]}),s&&t&&r.jsx("div",{className:a("pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"),children:r.jsx(d,{variant:"ghost",size:"sm",className:"pointer-events-auto whitespace-nowrap !-ml-1.5",children:r.jsxs(p,{to:s,children:[t,r.jsx(x,{width:16,height:16,className:"ml-2 inline-block"})]})})}),r.jsx("div",{className:"pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10"})]},e)}export{g as B,m as a};