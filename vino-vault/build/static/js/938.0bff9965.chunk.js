/*! For license information please see 938.0bff9965.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkionic_ecommerce_example=self.webpackChunkionic_ecommerce_example||[]).push([[938],{938:(e,t,o)=>{o.r(t),o.d(t,{startTapClick:()=>i});var n=o(384);const i=e=>{let t,o,i,v=10*-u,f=0;const p=e.getBoolean("animated",!0)&&e.getBoolean("rippleEffect",!0),m=new WeakMap,h=e=>{v=(0,n.u)(e),E(e)},L=()=>{i&&clearTimeout(i),i=void 0,t&&(g(!1),t=void 0)},w=e=>{t||b(s(e),e)},E=e=>{b(void 0,e)},b=(e,o)=>{if(e&&e===t)return;i&&clearTimeout(i),i=void 0;const{x:s,y:c}=(0,n.p)(o);if(t){if(m.has(t))throw new Error("internal error");t.classList.contains(r)||k(t,s,c),g(!0)}if(e){const t=m.get(e);t&&(clearTimeout(t),m.delete(e)),e.classList.remove(r);const o=()=>{k(e,s,c),i=void 0};a(e)?o():i=setTimeout(o,d)}t=e},k=(e,t,n)=>{if(f=Date.now(),e.classList.add(r),!p)return;const i=c(e);null!==i&&(T(),o=i.addRipple(t,n))},T=()=>{void 0!==o&&(o.then((e=>e())),o=void 0)},g=e=>{T();const o=t;if(!o)return;const n=l-Date.now()+f;if(e&&n>0&&!a(o)){const e=setTimeout((()=>{o.classList.remove(r),m.delete(o)}),l);m.set(o,e)}else o.classList.remove(r)},C=document;C.addEventListener("ionGestureCaptured",L),C.addEventListener("touchstart",(e=>{v=(0,n.u)(e),w(e)}),!0),C.addEventListener("touchcancel",h,!0),C.addEventListener("touchend",h,!0),C.addEventListener("pointercancel",L,!0),C.addEventListener("mousedown",(e=>{if(2===e.button)return;const t=(0,n.u)(e)-u;v<t&&w(e)}),!0),C.addEventListener("mouseup",(e=>{const t=(0,n.u)(e)-u;v<t&&E(e)}),!0)},s=e=>{if(void 0===e.composedPath)return e.target.closest(".ion-activatable");{const t=e.composedPath();for(let e=0;e<t.length-2;e++){const o=t[e];if(!(o instanceof ShadowRoot)&&o.classList.contains("ion-activatable"))return o}}},a=e=>e.classList.contains("ion-activatable-instant"),c=e=>{if(e.shadowRoot){const t=e.shadowRoot.querySelector("ion-ripple-effect");if(t)return t}return e.querySelector("ion-ripple-effect")},r="ion-activated",d=200,l=200,u=2500}}]);
//# sourceMappingURL=938.0bff9965.chunk.js.map