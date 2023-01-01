import{f as X,a as u,b as H,F as D,j as C,h as V,k as z}from"./index-dea4d47d.js";import{R as d,b as S,r as N}from"./islands-8df48262.js";import{u as L}from"./context-cc1a0ef2.js";import{ThemeModeSwitch as B}from"./index-0be5137b.js";function T(){return T=Object.assign?Object.assign.bind():function(n){for(var r=1;r<arguments.length;r++){var i=arguments[r];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(n[t]=i[t])}return n},T.apply(this,arguments)}function j(n,r){if(n==null)return{};var i={},t=Object.keys(n),s,e;for(e=0;e<t.length;e++)s=t[e],!(r.indexOf(s)>=0)&&(i[s]=n[s]);return i}function $(n,r){return $=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,s){return t.__proto__=s,t},$(n,r)}function P(n,r){n.prototype=Object.create(r.prototype),n.prototype.constructor=n,$(n,r)}function K(n,r){return n.classList?!!r&&n.classList.contains(r):(" "+(n.className.baseVal||n.className)+" ").indexOf(" "+r+" ")!==-1}function q(n,r){n.classList?n.classList.add(r):K(n,r)||(typeof n.className=="string"?n.className=n.className+" "+r:n.setAttribute("class",(n.className&&n.className.baseVal||"")+" "+r))}function _(n,r){return n.replace(new RegExp("(^|\\s)"+r+"(?:\\s|$)","g"),"$1").replace(/\s+/g," ").replace(/^\s*|\s*$/g,"")}function J(n,r){n.classList?n.classList.remove(r):typeof n.className=="string"?n.className=_(n.className,r):n.setAttribute("class",_(n.className&&n.className.baseVal||"",r))}const w={disabled:!1},I=d.createContext(null);var M=function(r){return r.scrollTop},b="unmounted",v="exited",m="entering",g="entered",y="exiting",h=function(n){P(r,n);function r(t,s){var e;e=n.call(this,t,s)||this;var o=s,a=o&&!o.isMounting?t.enter:t.appear,l;return e.appearStatus=null,t.in?a?(l=v,e.appearStatus=m):l=g:t.unmountOnExit||t.mountOnEnter?l=b:l=v,e.state={status:l},e.nextCallback=null,e}r.getDerivedStateFromProps=function(s,e){var o=s.in;return o&&e.status===b?{status:v}:null};var i=r.prototype;return i.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},i.componentDidUpdate=function(s){var e=null;if(s!==this.props){var o=this.state.status;this.props.in?o!==m&&o!==g&&(e=m):(o===m||o===g)&&(e=y)}this.updateStatus(!1,e)},i.componentWillUnmount=function(){this.cancelNextCallback()},i.getTimeouts=function(){var s=this.props.timeout,e,o,a;return e=o=a=s,s!=null&&typeof s!="number"&&(e=s.exit,o=s.enter,a=s.appear!==void 0?s.appear:o),{exit:e,enter:o,appear:a}},i.updateStatus=function(s,e){if(s===void 0&&(s=!1),e!==null)if(this.cancelNextCallback(),e===m){if(this.props.unmountOnExit||this.props.mountOnEnter){var o=this.props.nodeRef?this.props.nodeRef.current:S.findDOMNode(this);o&&M(o)}this.performEnter(s)}else this.performExit();else this.props.unmountOnExit&&this.state.status===v&&this.setState({status:b})},i.performEnter=function(s){var e=this,o=this.props.enter,a=this.context?this.context.isMounting:s,l=this.props.nodeRef?[a]:[S.findDOMNode(this),a],c=l[0],p=l[1],f=this.getTimeouts(),x=a?f.appear:f.enter;if(!s&&!o||w.disabled){this.safeSetState({status:g},function(){e.props.onEntered(c)});return}this.props.onEnter(c,p),this.safeSetState({status:m},function(){e.props.onEntering(c,p),e.onTransitionEnd(x,function(){e.safeSetState({status:g},function(){e.props.onEntered(c,p)})})})},i.performExit=function(){var s=this,e=this.props.exit,o=this.getTimeouts(),a=this.props.nodeRef?void 0:S.findDOMNode(this);if(!e||w.disabled){this.safeSetState({status:v},function(){s.props.onExited(a)});return}this.props.onExit(a),this.safeSetState({status:y},function(){s.props.onExiting(a),s.onTransitionEnd(o.exit,function(){s.safeSetState({status:v},function(){s.props.onExited(a)})})})},i.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},i.safeSetState=function(s,e){e=this.setNextCallback(e),this.setState(s,e)},i.setNextCallback=function(s){var e=this,o=!0;return this.nextCallback=function(a){o&&(o=!1,e.nextCallback=null,s(a))},this.nextCallback.cancel=function(){o=!1},this.nextCallback},i.onTransitionEnd=function(s,e){this.setNextCallback(e);var o=this.props.nodeRef?this.props.nodeRef.current:S.findDOMNode(this),a=s==null&&!this.props.addEndListener;if(!o||a){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var l=this.props.nodeRef?[this.nextCallback]:[o,this.nextCallback],c=l[0],p=l[1];this.props.addEndListener(c,p)}s!=null&&setTimeout(this.nextCallback,s)},i.render=function(){var s=this.state.status;if(s===b)return null;var e=this.props,o=e.children;e.in,e.mountOnEnter,e.unmountOnExit,e.appear,e.enter,e.exit,e.timeout,e.addEndListener,e.onEnter,e.onEntering,e.onEntered,e.onExit,e.onExiting,e.onExited,e.nodeRef;var a=j(e,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return d.createElement(I.Provider,{value:null},typeof o=="function"?o(s,a):d.cloneElement(d.Children.only(o),a))},r}(d.Component);h.contextType=I;h.propTypes={};function E(){}h.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:E,onEntering:E,onEntered:E,onExit:E,onExiting:E,onExited:E};h.UNMOUNTED=b;h.EXITED=v;h.ENTERING=m;h.ENTERED=g;h.EXITING=y;const Q=h;var Y=function(r,i){return r&&i&&i.split(" ").forEach(function(t){return q(r,t)})},O=function(r,i){return r&&i&&i.split(" ").forEach(function(t){return J(r,t)})},k=function(n){P(r,n);function r(){for(var t,s=arguments.length,e=new Array(s),o=0;o<s;o++)e[o]=arguments[o];return t=n.call.apply(n,[this].concat(e))||this,t.appliedClasses={appear:{},enter:{},exit:{}},t.onEnter=function(a,l){var c=t.resolveArguments(a,l),p=c[0],f=c[1];t.removeClasses(p,"exit"),t.addClass(p,f?"appear":"enter","base"),t.props.onEnter&&t.props.onEnter(a,l)},t.onEntering=function(a,l){var c=t.resolveArguments(a,l),p=c[0],f=c[1],x=f?"appear":"enter";t.addClass(p,x,"active"),t.props.onEntering&&t.props.onEntering(a,l)},t.onEntered=function(a,l){var c=t.resolveArguments(a,l),p=c[0],f=c[1],x=f?"appear":"enter";t.removeClasses(p,x),t.addClass(p,x,"done"),t.props.onEntered&&t.props.onEntered(a,l)},t.onExit=function(a){var l=t.resolveArguments(a),c=l[0];t.removeClasses(c,"appear"),t.removeClasses(c,"enter"),t.addClass(c,"exit","base"),t.props.onExit&&t.props.onExit(a)},t.onExiting=function(a){var l=t.resolveArguments(a),c=l[0];t.addClass(c,"exit","active"),t.props.onExiting&&t.props.onExiting(a)},t.onExited=function(a){var l=t.resolveArguments(a),c=l[0];t.removeClasses(c,"exit"),t.addClass(c,"exit","done"),t.props.onExited&&t.props.onExited(a)},t.resolveArguments=function(a,l){return t.props.nodeRef?[t.props.nodeRef.current,a]:[a,l]},t.getClassNames=function(a){var l=t.props.classNames,c=typeof l=="string",p=c&&l?l+"-":"",f=c?""+p+a:l[a],x=c?f+"-active":l[a+"Active"],F=c?f+"-done":l[a+"Done"];return{baseClassName:f,activeClassName:x,doneClassName:F}},t}var i=r.prototype;return i.addClass=function(s,e,o){var a=this.getClassNames(e)[o+"ClassName"],l=this.getClassNames("enter"),c=l.doneClassName;e==="appear"&&o==="done"&&c&&(a+=" "+c),o==="active"&&s&&M(s),a&&(this.appliedClasses[e][o]=a,Y(s,a))},i.removeClasses=function(s,e){var o=this.appliedClasses[e],a=o.base,l=o.active,c=o.done;this.appliedClasses[e]={},a&&O(s,a),l&&O(s,l),c&&O(s,c)},i.render=function(){var s=this.props;s.classNames;var e=j(s,["classNames"]);return d.createElement(Q,T({},e,{onEnter:this.onEnter,onEntered:this.onEntered,onEntering:this.onEntering,onExit:this.onExit,onExiting:this.onExiting,onExited:this.onExited}))},r}(d.Component);k.defaultProps={classNames:""};k.propTypes={};const Z=k;function tt({link:n,activeMatch:r},i){if(!n)return!1;if(r)return new RegExp(r).test(i);const t=i.substring(n.length);return i.startsWith(n)&&(!t||t.startsWith("/"))}function U({link:n,activeMatch:r}){const{pathname:i}=X();return N.exports.useMemo(()=>tt({link:n,activeMatch:r},i),[n,r,i])}function A(n){const{to:r="",children:i,className:t="",color:s=!0,...e}=n,o=!r.startsWith("http"),a=r.startsWith("#"),l=`${t} ${s?"text-c-brand hover:text-c-brand-light transition-colors":""}`;return o&&!a?u(H,{...e,className:l,to:r,children:u(D,{children:i})}):u("a",{...e,className:l,href:r,...!a&&{target:"_blank"},children:i})}function W({text:n,icon:r,space:i,as:t=d.Fragment,className:s}){const e=Array.isArray(r)?r[0]:r,o=Array.isArray(r)?r[1]:void 0;return d.createElement(t,s&&{className:s},C(D,{children:[e&&d.createElement(e,{...o,...i!=null&&{style:{marginRight:i,...o==null?void 0:o.style}}}),u("span",{children:n})]}))}function et({size:n,className:r}){const{iconNav:i}=L();return i!=null&&i.length?u("div",{className:`${r} flex justify-start items-center flex-wrap`,children:i.map((t,s)=>t.icon&&u(A,{to:t.link,color:!1,className:`flex justify-center items-center text-c-text-2 transition-colors hover:text-c-brand
              ${n==="small"?"w-9 h-9 text-[17px]":""}
              ${n==="medium"?"w-12 h-12 text-xl":""}`,children:d.createElement(t.icon)},s))}):null}const G=N.exports.createContext(null),R=()=>N.exports.useContext(G);function nt(){const{screenOpen:n,toggleScreen:r}=R(),i="w-full h-0.5 bg-c-text-0 rounded-full absolute left-0 transition-all";return u("button",{className:"group w-12 h-full inline-flex justify-center items-center",onClick:r,children:C("div",{className:"relative w-4 h-3.5 overflow-hidden",children:[u("div",{className:`${i} top-0
            ${n?"translate-y-1.5 -rotate-45":"group-hover:translate-x-1"}
          `}),u("div",{className:`${i} top-1.5 translate-x-2
            ${n?"opacity-0":"opacity-100 group-hover:translate-x-0"}
          `}),u("div",{className:`${i} bottom-0 translate-x-1 ${n?"translate-x-0 -translate-y-1.5 rotate-45":"group-hover:translate-x-2"}`})]})})}function st({item:n}){var a,l;const{toggleScreen:r}=R(),[i,t]=N.exports.useState(!1),s=U(n),e=Boolean((a=n.items)==null?void 0:a.length),o=C("div",{className:"flex justify-between items-center h-12 cursor-pointer",children:[u("span",{className:`flex items-center font-medium
          ${s?"text-c-brand":"text-c-text-0"}
        `,children:u(W,{text:n.text,icon:n.icon,space:"8px"})}),e&&u(z,{className:`text-c-text-2 transition-transform ${i?"rotate-90":""}`})]});return C("div",{className:"border-b border-c-border-1 text-sm",children:[e?u("div",{onClick:()=>t(c=>!c),children:o}):u(A,{to:n.link,onClick:r,children:o}),e&&i&&u("div",{className:"mb-2 py-2 rounded-lg bg-c-bg-1",children:(l=n.items)==null?void 0:l.map((c,p)=>u(rt,{item:c},p))})]})}function rt({item:n}){const{toggleScreen:r}=R(),i=U(n);return u(A,{className:`flex items-center h-8 px-4 ${i?"text-c-brand":"text-c-text-0"}`,to:n.link,color:!1,onClick:r,children:u(W,{text:n.text,icon:n.icon,space:"8px"})})}function ct(){const{textNav:n}=L(),{pagePath:r}=V(),[i,t]=N.exports.useState(!1),s=()=>{t(e=>!e)};return N.exports.useEffect(()=>{t(!1)},[r]),C(G.Provider,{value:{screenOpen:i,toggleScreen:s},children:[u(nt,{}),u(Z,{classNames:"nav-screen-anim",in:i,timeout:300,mountOnEnter:!0,unmountOnExit:!0,children:u("div",{className:"fixed z-[var(--z-index-nav-screen)] top-[calc(var(--header-height)+var(--banner-height))] bottom-0 left-0 right-0 w-full px-8 py-6 bg-c-bg-0 overflow-y-auto",children:C("div",{className:"nav-screen-container max-w-[288px] mx-auto",children:[n.map((e,o)=>u(st,{item:e},o)),u(B,{className:"mt-6 px-4 py-3 rounded-lg bg-c-bg-1",showLabel:!0}),u(et,{className:"mt-2 flex justify-center",size:"medium"})]})})})]})}export{ct as NavScreen};
