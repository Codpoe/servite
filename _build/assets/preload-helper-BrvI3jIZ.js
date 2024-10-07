import{g as M,R as y,r as D}from"./jsx-runtime-OjB1YB6s.js";var X=typeof Element<"u",ee=typeof Map=="function",te=typeof Set=="function",re=typeof ArrayBuffer=="function"&&!!ArrayBuffer.isView;function S(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var r,n,s;if(Array.isArray(e)){if(r=e.length,r!=t.length)return!1;for(n=r;n--!==0;)if(!S(e[n],t[n]))return!1;return!0}var o;if(ee&&e instanceof Map&&t instanceof Map){if(e.size!==t.size)return!1;for(o=e.entries();!(n=o.next()).done;)if(!t.has(n.value[0]))return!1;for(o=e.entries();!(n=o.next()).done;)if(!S(n.value[1],t.get(n.value[0])))return!1;return!0}if(te&&e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(o=e.entries();!(n=o.next()).done;)if(!t.has(n.value[0]))return!1;return!0}if(re&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(t)){if(r=e.length,r!=t.length)return!1;for(n=r;n--!==0;)if(e[n]!==t[n])return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf&&typeof e.valueOf=="function"&&typeof t.valueOf=="function")return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString&&typeof e.toString=="function"&&typeof t.toString=="function")return e.toString()===t.toString();if(s=Object.keys(e),r=s.length,r!==Object.keys(t).length)return!1;for(n=r;n--!==0;)if(!Object.prototype.hasOwnProperty.call(t,s[n]))return!1;if(X&&e instanceof Element)return!1;for(n=r;n--!==0;)if(!((s[n]==="_owner"||s[n]==="__v"||s[n]==="__o")&&e.$$typeof)&&!S(e[s[n]],t[s[n]]))return!1;return!0}return e!==e&&t!==t}var ne=function(t,r){try{return S(t,r)}catch(n){if((n.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw n}};const se=M(ne);var oe=function(e,t,r,n,s,o,c,i){if(!e){var l;if(t===void 0)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var a=[r,n,s,o,c,i],u=0;l=new Error(t.replace(/%s/g,function(){return a[u++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}},ie=oe;const U=M(ie);var ae=function(t,r,n,s){var o=n?n.call(s,t,r):void 0;if(o!==void 0)return!!o;if(t===r)return!0;if(typeof t!="object"||!t||typeof r!="object"||!r)return!1;var c=Object.keys(t),i=Object.keys(r);if(c.length!==i.length)return!1;for(var l=Object.prototype.hasOwnProperty.bind(r),a=0;a<c.length;a++){var u=c[a];if(!l(u))return!1;var f=t[u],p=r[u];if(o=n?n.call(s,f,p,u):void 0,o===!1||o===void 0&&f!==p)return!1}return!0};const le=M(ae);var V=(e=>(e.BASE="base",e.BODY="body",e.HEAD="head",e.HTML="html",e.LINK="link",e.META="meta",e.NOSCRIPT="noscript",e.SCRIPT="script",e.STYLE="style",e.TITLE="title",e.FRAGMENT="Symbol(react.fragment)",e))(V||{}),x={link:{rel:["amphtml","canonical","alternate"]},script:{type:["application/ld+json"]},meta:{charset:"",name:["generator","robots","description"],property:["og:type","og:title","og:url","og:image","og:image:alt","og:description","twitter:url","twitter:title","twitter:description","twitter:image","twitter:image:alt","twitter:card","twitter:site"]}},F=Object.values(V),R={accesskey:"accessKey",charset:"charSet",class:"className",contenteditable:"contentEditable",contextmenu:"contextMenu","http-equiv":"httpEquiv",itemprop:"itemProp",tabindex:"tabIndex"},ce=Object.entries(R).reduce((e,[t,r])=>(e[r]=t,e),{}),h="data-rh",v={DEFAULT_TITLE:"defaultTitle",DEFER:"defer",ENCODE_SPECIAL_CHARACTERS:"encodeSpecialCharacters",ON_CHANGE_CLIENT_STATE:"onChangeClientState",TITLE_TEMPLATE:"titleTemplate",PRIORITIZE_SEO_TAGS:"prioritizeSeoTags"},A=(e,t)=>{for(let r=e.length-1;r>=0;r-=1){const n=e[r];if(Object.prototype.hasOwnProperty.call(n,t))return n[t]}return null},ue=e=>{let t=A(e,"title");const r=A(e,v.TITLE_TEMPLATE);if(Array.isArray(t)&&(t=t.join("")),r&&t)return r.replace(/%s/g,()=>t);const n=A(e,v.DEFAULT_TITLE);return t||n||void 0},fe=e=>A(e,v.ON_CHANGE_CLIENT_STATE)||(()=>{}),P=(e,t)=>t.filter(r=>typeof r[e]<"u").map(r=>r[e]).reduce((r,n)=>({...r,...n}),{}),pe=(e,t)=>t.filter(r=>typeof r.base<"u").map(r=>r.base).reverse().reduce((r,n)=>{if(!r.length){const s=Object.keys(n);for(let o=0;o<s.length;o+=1){const i=s[o].toLowerCase();if(e.indexOf(i)!==-1&&n[i])return r.concat(n)}}return r},[]),de=e=>console&&typeof console.warn=="function"&&console.warn(e),E=(e,t,r)=>{const n={};return r.filter(s=>Array.isArray(s[e])?!0:(typeof s[e]<"u"&&de(`Helmet: ${e} should be of type "Array". Instead found type "${typeof s[e]}"`),!1)).map(s=>s[e]).reverse().reduce((s,o)=>{const c={};o.filter(l=>{let a;const u=Object.keys(l);for(let p=0;p<u.length;p+=1){const d=u[p],T=d.toLowerCase();t.indexOf(T)!==-1&&!(a==="rel"&&l[a].toLowerCase()==="canonical")&&!(T==="rel"&&l[T].toLowerCase()==="stylesheet")&&(a=T),t.indexOf(d)!==-1&&(d==="innerHTML"||d==="cssText"||d==="itemprop")&&(a=d)}if(!a||!l[a])return!1;const f=l[a].toLowerCase();return n[a]||(n[a]={}),c[a]||(c[a]={}),n[a][f]?!1:(c[a][f]=!0,!0)}).reverse().forEach(l=>s.push(l));const i=Object.keys(c);for(let l=0;l<i.length;l+=1){const a=i[l],u={...n[a],...c[a]};n[a]=u}return s},[]).reverse()},me=(e,t)=>{if(Array.isArray(e)&&e.length){for(let r=0;r<e.length;r+=1)if(e[r][t])return!0}return!1},he=e=>({baseTag:pe(["href"],e),bodyAttributes:P("bodyAttributes",e),defer:A(e,v.DEFER),encode:A(e,v.ENCODE_SPECIAL_CHARACTERS),htmlAttributes:P("htmlAttributes",e),linkTags:E("link",["rel","href"],e),metaTags:E("meta",["name","charset","http-equiv","property","itemprop"],e),noscriptTags:E("noscript",["innerHTML"],e),onChangeClientState:fe(e),scriptTags:E("script",["src","innerHTML"],e),styleTags:E("style",["cssText"],e),title:ue(e),titleAttributes:P("titleAttributes",e),prioritizeSeoTags:me(e,v.PRIORITIZE_SEO_TAGS)}),Y=e=>Array.isArray(e)?e.join(""):e,ye=(e,t)=>{const r=Object.keys(e);for(let n=0;n<r.length;n+=1)if(t[r[n]]&&t[r[n]].includes(e[r[n]]))return!0;return!1},$=(e,t)=>Array.isArray(e)?e.reduce((r,n)=>(ye(n,t)?r.priority.push(n):r.default.push(n),r),{priority:[],default:[]}):{default:e,priority:[]},q=(e,t)=>({...e,[t]:void 0}),Te=["noscript","script","style"],I=(e,t=!0)=>t===!1?String(e):String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;"),B=e=>Object.keys(e).reduce((t,r)=>{const n=typeof e[r]<"u"?`${r}="${e[r]}"`:`${r}`;return t?`${t} ${n}`:n},""),ge=(e,t,r,n)=>{const s=B(r),o=Y(t);return s?`<${e} ${h}="true" ${s}>${I(o,n)}</${e}>`:`<${e} ${h}="true">${I(o,n)}</${e}>`},ve=(e,t,r=!0)=>t.reduce((n,s)=>{const o=s,c=Object.keys(o).filter(a=>!(a==="innerHTML"||a==="cssText")).reduce((a,u)=>{const f=typeof o[u]>"u"?u:`${u}="${I(o[u],r)}"`;return a?`${a} ${f}`:f},""),i=o.innerHTML||o.cssText||"",l=Te.indexOf(e)===-1;return`${n}<${e} ${h}="true" ${c}${l?"/>":`>${i}</${e}>`}`},""),W=(e,t={})=>Object.keys(e).reduce((r,n)=>{const s=R[n];return r[s||n]=e[n],r},t),Ae=(e,t,r)=>{const n={key:t,[h]:!0},s=W(r,n);return[y.createElement("title",s,t)]},w=(e,t)=>t.map((r,n)=>{const s={key:n,[h]:!0};return Object.keys(r).forEach(o=>{const i=R[o]||o;if(i==="innerHTML"||i==="cssText"){const l=r.innerHTML||r.cssText;s.dangerouslySetInnerHTML={__html:l}}else s[i]=r[o]}),y.createElement(e,s)}),m=(e,t,r=!0)=>{switch(e){case"title":return{toComponent:()=>Ae(e,t.title,t.titleAttributes),toString:()=>ge(e,t.title,t.titleAttributes,r)};case"bodyAttributes":case"htmlAttributes":return{toComponent:()=>W(t),toString:()=>B(t)};default:return{toComponent:()=>w(e,t),toString:()=>ve(e,t,r)}}},Ee=({metaTags:e,linkTags:t,scriptTags:r,encode:n})=>{const s=$(e,x.meta),o=$(t,x.link),c=$(r,x.script);return{priorityMethods:{toComponent:()=>[...w("meta",s.priority),...w("link",o.priority),...w("script",c.priority)],toString:()=>`${m("meta",s.priority,n)} ${m("link",o.priority,n)} ${m("script",c.priority,n)}`},metaTags:s.default,linkTags:o.default,scriptTags:c.default}},be=e=>{const{baseTag:t,bodyAttributes:r,encode:n=!0,htmlAttributes:s,noscriptTags:o,styleTags:c,title:i="",titleAttributes:l,prioritizeSeoTags:a}=e;let{linkTags:u,metaTags:f,scriptTags:p}=e,d={toComponent:()=>{},toString:()=>""};return a&&({priorityMethods:d,linkTags:u,metaTags:f,scriptTags:p}=Ee(e)),{priority:d,base:m("base",t,n),bodyAttributes:m("bodyAttributes",r,n),htmlAttributes:m("htmlAttributes",s,n),link:m("link",u,n),meta:m("meta",f,n),noscript:m("noscript",o,n),script:m("script",p,n),style:m("style",c,n),title:m("title",{title:i,titleAttributes:l},n)}},k=be,O=[],Z=!!(typeof window<"u"&&window.document&&window.document.createElement),H=class{instances=[];canUseDOM=Z;context;value={setHelmet:e=>{this.context.helmet=e},helmetInstances:{get:()=>this.canUseDOM?O:this.instances,add:e=>{(this.canUseDOM?O:this.instances).push(e)},remove:e=>{const t=(this.canUseDOM?O:this.instances).indexOf(e);(this.canUseDOM?O:this.instances).splice(t,1)}}};constructor(e,t){this.context=e,this.canUseDOM=t||!1,t||(e.helmet=k({baseTag:[],bodyAttributes:{},encodeSpecialCharacters:!0,htmlAttributes:{},linkTags:[],metaTags:[],noscriptTags:[],scriptTags:[],styleTags:[],title:"",titleAttributes:{}}))}},Ce={},G=y.createContext(Ce),Oe=class J extends D.Component{static canUseDOM=Z;helmetData;constructor(t){super(t),this.helmetData=new H(this.props.context||{},J.canUseDOM)}render(){return y.createElement(G.Provider,{value:this.helmetData.value},this.props.children)}},g=(e,t)=>{const r=document.head||document.querySelector("head"),n=r.querySelectorAll(`${e}[${h}]`),s=[].slice.call(n),o=[];let c;return t&&t.length&&t.forEach(i=>{const l=document.createElement(e);for(const a in i)if(Object.prototype.hasOwnProperty.call(i,a))if(a==="innerHTML")l.innerHTML=i.innerHTML;else if(a==="cssText")l.styleSheet?l.styleSheet.cssText=i.cssText:l.appendChild(document.createTextNode(i.cssText));else{const u=a,f=typeof i[u]>"u"?"":i[u];l.setAttribute(a,f)}l.setAttribute(h,"true"),s.some((a,u)=>(c=u,l.isEqualNode(a)))?s.splice(c,1):o.push(l)}),s.forEach(i=>i.parentNode?.removeChild(i)),o.forEach(i=>r.appendChild(i)),{oldTags:s,newTags:o}},_=(e,t)=>{const r=document.getElementsByTagName(e)[0];if(!r)return;const n=r.getAttribute(h),s=n?n.split(","):[],o=[...s],c=Object.keys(t);for(const i of c){const l=t[i]||"";r.getAttribute(i)!==l&&r.setAttribute(i,l),s.indexOf(i)===-1&&s.push(i);const a=o.indexOf(i);a!==-1&&o.splice(a,1)}for(let i=o.length-1;i>=0;i-=1)r.removeAttribute(o[i]);s.length===o.length?r.removeAttribute(h):r.getAttribute(h)!==c.join(",")&&r.setAttribute(h,c.join(","))},Se=(e,t)=>{typeof e<"u"&&document.title!==e&&(document.title=Y(e)),_("title",t)},K=(e,t)=>{const{baseTag:r,bodyAttributes:n,htmlAttributes:s,linkTags:o,metaTags:c,noscriptTags:i,onChangeClientState:l,scriptTags:a,styleTags:u,title:f,titleAttributes:p}=e;_("body",n),_("html",s),Se(f,p);const d={baseTag:g("base",r),linkTags:g("link",o),metaTags:g("meta",c),noscriptTags:g("noscript",i),scriptTags:g("script",a),styleTags:g("style",u)},T={},L={};Object.keys(d).forEach(C=>{const{newTags:j,oldTags:Q}=d[C];j.length&&(T[C]=j),Q.length&&(L[C]=d[C].oldTags)}),t&&t(),l(e,T,L)},b=null,we=e=>{b&&cancelAnimationFrame(b),e.defer?b=requestAnimationFrame(()=>{K(e,()=>{b=null})}):(K(e),b=null)},xe=we,z=class extends D.Component{rendered=!1;shouldComponentUpdate(e){return!le(e,this.props)}componentDidUpdate(){this.emitChange()}componentWillUnmount(){const{helmetInstances:e}=this.props.context;e.remove(this),this.emitChange()}emitChange(){const{helmetInstances:e,setHelmet:t}=this.props.context;let r=null;const n=he(e.get().map(s=>{const o={...s.props};return delete o.context,o}));Oe.canUseDOM?xe(n):k&&(r=k(n)),t(r)}init(){if(this.rendered)return;this.rendered=!0;const{helmetInstances:e}=this.props.context;e.add(this),this.emitChange()}render(){return this.init(),null}},ke=class extends D.Component{static defaultProps={defer:!0,encodeSpecialCharacters:!0,prioritizeSeoTags:!1};shouldComponentUpdate(e){return!se(q(this.props,"helmetData"),q(e,"helmetData"))}mapNestedChildrenToProps(e,t){if(!t)return null;switch(e.type){case"script":case"noscript":return{innerHTML:t};case"style":return{cssText:t};default:throw new Error(`<${e.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`)}}flattenArrayTypeChildren(e,t,r,n){return{...t,[e.type]:[...t[e.type]||[],{...r,...this.mapNestedChildrenToProps(e,n)}]}}mapObjectTypeChildren(e,t,r,n){switch(e.type){case"title":return{...t,[e.type]:n,titleAttributes:{...r}};case"body":return{...t,bodyAttributes:{...r}};case"html":return{...t,htmlAttributes:{...r}};default:return{...t,[e.type]:{...r}}}}mapArrayTypeChildrenToProps(e,t){let r={...t};return Object.keys(e).forEach(n=>{r={...r,[n]:e[n]}}),r}warnOnInvalidChildren(e,t){return U(F.some(r=>e.type===r),typeof e.type=="function"?"You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.":`Only elements types ${F.join(", ")} are allowed. Helmet does not support rendering <${e.type}> elements. Refer to our API for more information.`),U(!t||typeof t=="string"||Array.isArray(t)&&!t.some(r=>typeof r!="string"),`Helmet expects a string as a child of <${e.type}>. Did you forget to wrap your children in braces? ( <${e.type}>{\`\`}</${e.type}> ) Refer to our API for more information.`),!0}mapChildrenToProps(e,t){let r={};return y.Children.forEach(e,n=>{if(!n||!n.props)return;const{children:s,...o}=n.props,c=Object.keys(o).reduce((l,a)=>(l[ce[a]||a]=o[a],l),{});let{type:i}=n;switch(typeof i=="symbol"?i=i.toString():this.warnOnInvalidChildren(n,s),i){case"Symbol(react.fragment)":t=this.mapChildrenToProps(s,t);break;case"link":case"meta":case"noscript":case"script":case"style":r=this.flattenArrayTypeChildren(n,r,c,s);break;default:t=this.mapObjectTypeChildren(n,t,c,s);break}}),this.mapArrayTypeChildrenToProps(r,t)}render(){const{children:e,...t}=this.props;let r={...t},{helmetData:n}=t;if(e&&(r=this.mapChildrenToProps(e,r)),n&&!(n instanceof H)){const s=n;n=new H(s.context,!0),delete r.helmetData}return n?y.createElement(z,{...r,context:n.value}):y.createElement(G.Consumer,null,s=>y.createElement(z,{...r,context:s}))}};const Pe="modulepreload",$e=function(e){return"/servite/_build/"+e},N={},He=function(t,r,n){let s=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");s=Promise.all(r.map(i=>{if(i=$e(i),i in N)return;N[i]=!0;const l=i.endsWith(".css"),a=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${a}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":Pe,l||(u.as="script",u.crossOrigin=""),u.href=i,c&&u.setAttribute("nonce",c),document.head.appendChild(u),l)return new Promise((f,p)=>{u.addEventListener("load",f),u.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${i}`)))})}))}return s.then(()=>t()).catch(o=>{const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o})};export{Oe as H,He as _,ke as a};