/*! For license information please see 440.66a51f10.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkionic_ecommerce_example=self.webpackChunkionic_ecommerce_example||[]).push([[440],{440:(e,t,i)=>{i.r(t),i.d(t,{KEYBOARD_DID_CLOSE:()=>s,KEYBOARD_DID_OPEN:()=>o,copyVisualViewport:()=>D,keyboardDidClose:()=>w,keyboardDidOpen:()=>g,keyboardDidResize:()=>l,resetKeyboardAssist:()=>n,setKeyboardClose:()=>b,setKeyboardOpen:()=>c,startKeyboardAssist:()=>h,trackViewportChanges:()=>y});const o="ionKeyboardDidShow",s="ionKeyboardDidHide";let a={},d={},r=!1;const n=()=>{a={},d={},r=!1},h=e=>{p(e),e.visualViewport&&(d=D(e.visualViewport),e.visualViewport.onresize=()=>{y(e),g()||l(e)?c(e):w(e)&&b(e)})},p=e=>{e.addEventListener("keyboardDidShow",(t=>c(e,t))),e.addEventListener("keyboardDidHide",(()=>b(e)))},c=(e,t)=>{f(e,t),r=!0},b=e=>{u(e),r=!1},g=()=>{const e=(a.height-d.height)*d.scale;return!r&&a.width===d.width&&e>150},l=e=>r&&!w(e),w=e=>r&&d.height===e.innerHeight,f=(e,t)=>{const i=t?t.keyboardHeight:e.innerHeight-d.height,s=new CustomEvent(o,{detail:{keyboardHeight:i}});e.dispatchEvent(s)},u=e=>{const t=new CustomEvent(s);e.dispatchEvent(t)},y=e=>{a=Object.assign({},d),d=D(e.visualViewport)},D=e=>({width:Math.round(e.width),height:Math.round(e.height),offsetTop:e.offsetTop,offsetLeft:e.offsetLeft,pageTop:e.pageTop,pageLeft:e.pageLeft,scale:e.scale})}}]);
//# sourceMappingURL=440.66a51f10.chunk.js.map