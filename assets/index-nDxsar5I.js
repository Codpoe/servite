import e from"react";const o={},u=e.createContext(o);function c(n){const t=e.useContext(u);return e.useMemo(function(){return typeof n=="function"?n(t):{...t,...n}},[t,n])}function a(n){let t;return n.disableParentContext?t=typeof n.components=="function"?n.components(o):n.components||o:t=c(n.components),e.createElement(u.Provider,{value:t},n.children)}export{a as M,c as u};
