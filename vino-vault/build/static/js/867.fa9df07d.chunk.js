/*! For license information please see 867.fa9df07d.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkionic_ecommerce_example=self.webpackChunkionic_ecommerce_example||[]).push([[867,304],{304:(t,e,r)=>{r.r(e),r.d(e,{GESTURE_CONTROLLER:()=>n,createGesture:()=>u});class s{constructor(t,e,r,s,i){this.id=e,this.name=r,this.disableScroll=i,this.priority=1e6*s+e,this.ctrl=t}canStart(){return!!this.ctrl&&this.ctrl.canStart(this.name)}start(){return!!this.ctrl&&this.ctrl.start(this.name,this.id,this.priority)}capture(){if(!this.ctrl)return!1;const t=this.ctrl.capture(this.name,this.id,this.priority);return t&&this.disableScroll&&this.ctrl.disableScroll(this.id),t}release(){this.ctrl&&(this.ctrl.release(this.id),this.disableScroll&&this.ctrl.enableScroll(this.id))}destroy(){this.release(),this.ctrl=void 0}}class i{constructor(t,e,r,s){this.id=e,this.disable=r,this.disableScroll=s,this.ctrl=t}block(){if(this.ctrl){if(this.disable)for(const t of this.disable)this.ctrl.disableGesture(t,this.id);this.disableScroll&&this.ctrl.disableScroll(this.id)}}unblock(){if(this.ctrl){if(this.disable)for(const t of this.disable)this.ctrl.enableGesture(t,this.id);this.disableScroll&&this.ctrl.enableScroll(this.id)}}destroy(){this.unblock(),this.ctrl=void 0}}const l="backdrop-no-scroll",n=new class{constructor(){this.gestureId=0,this.requestedStart=new Map,this.disabledGestures=new Map,this.disabledScroll=new Set}createGesture(t){var e;return new s(this,this.newID(),t.name,null!==(e=t.priority)&&void 0!==e?e:0,!!t.disableScroll)}createBlocker(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new i(this,this.newID(),t.disable,!!t.disableScroll)}start(t,e,r){return this.canStart(t)?(this.requestedStart.set(e,r),!0):(this.requestedStart.delete(e),!1)}capture(t,e,r){if(!this.start(t,e,r))return!1;const s=this.requestedStart;let i=-1e4;if(s.forEach((t=>{i=Math.max(i,t)})),i===r){this.capturedId=e,s.clear();const r=new CustomEvent("ionGestureCaptured",{detail:{gestureName:t}});return document.dispatchEvent(r),!0}return s.delete(e),!1}release(t){this.requestedStart.delete(t),this.capturedId===t&&(this.capturedId=void 0)}disableGesture(t,e){let r=this.disabledGestures.get(t);void 0===r&&(r=new Set,this.disabledGestures.set(t,r)),r.add(e)}enableGesture(t,e){const r=this.disabledGestures.get(t);void 0!==r&&r.delete(e)}disableScroll(t){this.disabledScroll.add(t),1===this.disabledScroll.size&&document.body.classList.add(l)}enableScroll(t){this.disabledScroll.delete(t),0===this.disabledScroll.size&&document.body.classList.remove(l)}canStart(t){return void 0===this.capturedId&&!this.isDisabled(t)}isCaptured(){return void 0!==this.capturedId}isScrollDisabled(){return this.disabledScroll.size>0}isDisabled(t){const e=this.disabledGestures.get(t);return!!(e&&e.size>0)}newID(){return this.gestureId++,this.gestureId}},a=(t,e,r,s)=>{const i=c(t)?{capture:!!s.capture,passive:!!s.passive}:!!s.capture;let l,n;return t.__zone_symbol__addEventListener?(l="__zone_symbol__addEventListener",n="__zone_symbol__removeEventListener"):(l="addEventListener",n="removeEventListener"),t[l](e,r,i),()=>{t[n](e,r,i)}},c=t=>{if(void 0===o)try{const e=Object.defineProperty({},"passive",{get:()=>{o=!0}});t.addEventListener("optsTest",(()=>{}),e)}catch(e){o=!1}return!!o};let o;const d=t=>t instanceof Document?t:t.ownerDocument,u=t=>{let e=!1,r=!1,s=!0,i=!1;const l=Object.assign({disableScroll:!1,direction:"x",gesturePriority:0,passive:!0,maxAngle:40,threshold:10},t),c=l.canStart,o=l.onWillStart,u=l.onStart,m=l.onEnd,p=l.notCaptured,S=l.onMove,y=l.threshold,f=l.passive,g=l.blurOnStart,X={type:"pan",startX:0,startY:0,startTime:0,currentX:0,currentY:0,velocityX:0,velocityY:0,deltaX:0,deltaY:0,currentTime:0,event:void 0,data:void 0},w=((t,e,r)=>{const s=r*(Math.PI/180),i="x"===t,l=Math.cos(s),n=e*e;let a=0,c=0,o=!1,d=0;return{start(t,e){a=t,c=e,d=0,o=!0},detect(t,e){if(!o)return!1;const r=t-a,s=e-c,u=r*r+s*s;if(u<n)return!1;const h=Math.sqrt(u),b=(i?r:s)/h;return d=b>l?1:b<-l?-1:0,o=!1,!0},isGesture:()=>0!==d,getDirection:()=>d}})(l.direction,l.threshold,l.maxAngle),Y=n.createGesture({name:t.gestureName,priority:t.gesturePriority,disableScroll:t.disableScroll}),_=()=>{e&&(i=!1,S&&S(X))},G=()=>!!Y.capture()&&(e=!0,s=!1,X.startX=X.currentX,X.startY=X.currentY,X.startTime=X.currentTime,o?o(X).then(E):E(),!0),E=()=>{g&&(()=>{if("undefined"!==typeof document){const t=document.activeElement;(null===t||void 0===t?void 0:t.blur)&&t.blur()}})(),u&&u(X),s=!0},D=()=>{e=!1,r=!1,i=!1,s=!0,Y.release()},I=t=>{const r=e,i=s;D(),i&&(h(X,t),r?m&&m(X):p&&p(X))},T=((t,e,r,s,i)=>{let l,n,c,o,u,h,b,v=0;const m=s=>{v=Date.now()+2e3,e(s)&&(!n&&r&&(n=a(t,"touchmove",r,i)),c||(c=a(s.target,"touchend",S,i)),o||(o=a(s.target,"touchcancel",S,i)))},p=s=>{v>Date.now()||e(s)&&(!h&&r&&(h=a(d(t),"mousemove",r,i)),b||(b=a(d(t),"mouseup",y,i)))},S=t=>{f(),s&&s(t)},y=t=>{g(),s&&s(t)},f=()=>{n&&n(),c&&c(),o&&o(),n=c=o=void 0},g=()=>{h&&h(),b&&b(),h=b=void 0},X=()=>{f(),g()},w=function(){arguments.length>0&&void 0!==arguments[0]&&!arguments[0]?(l&&l(),u&&u(),l=u=void 0,X()):(l||(l=a(t,"touchstart",m,i)),u||(u=a(t,"mousedown",p,i)))};return{enable:w,stop:X,destroy:()=>{w(!1),s=r=e=void 0}}})(l.el,(t=>{const e=v(t);return!(r||!s)&&(b(t,X),X.startX=X.currentX,X.startY=X.currentY,X.startTime=X.currentTime=e,X.velocityX=X.velocityY=X.deltaX=X.deltaY=0,X.event=t,(!c||!1!==c(X))&&(Y.release(),!!Y.start()&&(r=!0,0===y?G():(w.start(X.startX,X.startY),!0))))}),(t=>{e?!i&&s&&(i=!0,h(X,t),requestAnimationFrame(_)):(h(X,t),w.detect(X.currentX,X.currentY)&&(w.isGesture()&&G()||k()))}),I,{capture:!1,passive:f}),k=()=>{D(),T.stop(),p&&p(X)};return{enable(){let t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];t||(e&&I(void 0),D()),T.enable(t)},destroy(){Y.destroy(),T.destroy()}}},h=(t,e)=>{if(!e)return;const r=t.currentX,s=t.currentY,i=t.currentTime;b(e,t);const l=t.currentX,n=t.currentY,a=(t.currentTime=v(e))-i;if(a>0&&a<100){const e=(l-r)/a,i=(n-s)/a;t.velocityX=.7*e+.3*t.velocityX,t.velocityY=.7*i+.3*t.velocityY}t.deltaX=l-t.startX,t.deltaY=n-t.startY,t.event=e},b=(t,e)=>{let r=0,s=0;if(t){const e=t.changedTouches;if(e&&e.length>0){const t=e[0];r=t.clientX,s=t.clientY}else void 0!==t.pageX&&(r=t.pageX,s=t.pageY)}e.currentX=r,e.currentY=s},v=t=>t.timeStamp||Date.now()},867:(t,e,r)=>{r.r(e),r.d(e,{createSwipeBackGesture:()=>n});var s=r(384),i=r(406),l=r(304);const n=(t,e,r,n,a)=>{const c=t.ownerDocument.defaultView;let o=(0,i.i)(t);const d=t=>o?-t.deltaX:t.deltaX;return(0,l.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:r=>(o=(0,i.i)(t),(t=>{const{startX:e}=t;return o?e>=c.innerWidth-50:e<=50})(r)&&e()),onStart:r,onMove:t=>{const e=d(t)/c.innerWidth;n(e)},onEnd:t=>{const e=d(t),r=c.innerWidth,i=e/r,l=(t=>o?-t.velocityX:t.velocityX)(t),n=l>=0&&(l>.2||e>r/2),u=(n?1-i:i)*r;let h=0;if(u>5){const t=u/Math.abs(l);h=Math.min(t,540)}a(n,i<=0?.01:(0,s.h)(0,i,.9999),h)}})}}}]);
//# sourceMappingURL=867.fa9df07d.chunk.js.map