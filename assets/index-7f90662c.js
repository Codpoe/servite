import{j as r,a as e}from"./Link-9f02b2a1.js";import{g as i,T as c}from"./utils-e0103c60.js";import{a,M as l}from"./index-f1ca74f5.js";import"./islands-7bd2f825.js";function p({showLabel:s,className:t=""}){const o=e("div",{className:"relative w-10 h-[22px] border border-c-border-2 rounded-full bg-c-bg-1 cursor-pointer hover:border-c-brand transition-[border-color]",onClick:()=>{const n=i();window.localStorage.setItem(c,n==="light"?"dark":"light"),document.documentElement.classList.toggle("dark")},children:r("div",{className:"theme-mode-switch__circle w-[18px] h-[18px] rounded-full bg-c-bg-0 text-sm absolute top-px left-px transition-transform",children:[e(a,{className:"theme-mode-switch__sun absolute top-0.5 left-0.5 text-sm transition-all text-c-text-0"}),e(l,{className:"theme-mode-switch__moon absolute top-0.5 left-0.5 text-sm transition-all text-c-text-0"})]})});return s?r("div",{className:`${t} flex justify-between items-center`,children:[e("span",{className:"mr-6 text-xs font-medium text-c-text-1",children:"Theme Mode"}),o]}):e("div",{className:t,children:o})}export{p as ThemeModeSwitch};
