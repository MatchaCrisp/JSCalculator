(this["webpackJsonpjs-calc"]=this["webpackJsonpjs-calc"]||[]).push([[0],{46:function(e,t){},47:function(e,t,n){},48:function(e,t,n){"use strict";n.r(t);var i=n(9),c=n(30),s=n.n(c),r=n(10),a=function(){var e=function(){var e=window;return{w:e.innerWidth,h:e.innerHeight}},t=function(){a(e())},n=Object(i.useState)(e()),c=Object(r.a)(n,2),s=c[0],a=c[1];return Object(i.useEffect)((function(){return window.addEventListener("resize",t),function(){return window.removeEventListener("resize",t)}})),s},o=n(15),l=n(52),d=n(51),u=n(14),h=n(8),f=function(e){var t=function(){var t=function(e){if(e.includes("e")){var t=e.split("e");return t[0]=t[0].slice(0,15-t[1].length-3)+"(...)",t.join("e")}if(e.includes(".")){var n=e.split(".");return n[1]=n[1].slice(0,15-n[0].length-3)+"(...)",n.join(".")}return e},n=e.hist[0].length>15?t(e.hist[0]):e.hist[0];n+=" ".concat(e.hist[1]," "),n+=e.hist[2].length>15?t(e.hist[2]):e.hist[2];var i="= ";return i+=e.hist[3].length>15?t(e.hist[3]):e.hist[3],Object(h.jsxs)("div",{children:[Object(h.jsx)("p",{className:"hisOp",children:n}),Object(h.jsx)("p",{className:"hisRes",children:i})]})}();return Object(h.jsx)("div",{onClick:function(){e.handleHist(e.ind),e.handleExp(!0)},className:"histItem",children:t})},j=function(e){var t=Object(h.jsx)("i",{className:"fas fa-arrow-up"}),n=Object(h.jsx)("i",{className:"fas fa-arrow-down"}),i={transition:"height 200ms ease-in",height:e.power?"40px":"540px",boxShadow:e.power?"none":"0px 0px 10px #CCC"},c={height:"".concat(Math.min(540,e.h),"px")},s=function(t){e.handlePow(t)},r=[Object(h.jsx)("div",{id:"histHeader",children:"Past Calculations"},"-1")].concat(Object(u.a)(e.hist.map((function(t,n){return function(t,n){return Object(h.jsx)(f,{ind:n,hist:t,handleHist:e.handleHist,handleExp:s},t[4])}(t,n)}))));return Object(h.jsxs)("div",{id:"histList",style:e.w>900?Object(o.a)({},c):Object(o.a)({},i),children:[r,Object(h.jsx)("div",{id:"roller",onClick:e.w<=900?e.handlePow:void 0,style:{cursor:e.w>900?"default":"pointer"},children:e.w<=900?e.power?n:t:""})]})},b=function(e){var t="",n="";return""===e.res?(t=e.op1+" "+e.oper,n=e.op2):(t=e.op1+" "+e.oper+" "+e.op2+"=",n=e.res),Object(h.jsxs)("div",{id:"scr",children:[Object(h.jsx)("div",{id:"operation",children:Object(h.jsx)("p",{children:t})}),Object(h.jsx)("div",{id:"display",style:{fontSize:n.length>=15?"1rem":"2rem"},children:Object(h.jsx)("p",{children:n})})]})},p=n(22),O=n.n(p),g=n(26),v=function(e){var t,n=Object(i.useState)(!1),c=Object(r.a)(n,2),s=c[0],a=c[1];t="pow"===e.desc?Object(h.jsxs)("p",{children:["x",Object(h.jsx)("sup",{children:"2"})]}):"sqrt"===e.desc?Object(h.jsx)("p",{children:"\u221a"}):"sign"===e.desc?Object(h.jsx)("p",{children:"+/-"}):"bksp"===e.desc?Object(h.jsx)("i",{className:"fas fa-backspace"}):"e"===e.desc?Object(h.jsx)("p",{children:"EE"}):Object(h.jsx)("p",{children:e.desc}),Object(i.useEffect)((function(){if(""!==e.keyCode)return document.addEventListener("keydown",o),function(){document.removeEventListener("keydown",o)}}));var o=function(t){t.keyCode===parseInt(e.keyCode)&&(l(),53===t.keyCode?t.shiftKey&&e.handleEvent(e.desc):(t.preventDefault(),e.handleEvent(e.desc)))},l=function(){var e=Object(g.a)(O.a.mark((function e(){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a(!0),e.next=3,new Promise((function(e){return setTimeout(e,100)}));case 3:a(!1);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(h.jsx)("div",{className:"".concat(e.className," ").concat(s?"clicked":""),id:e.id,onClick:function(){l(),e.handleEvent(e.desc)},children:t})},x=function(e){var t=Object(i.useState)("https://raw.githubusercontent.com/MatchaCrisp/JSCalculator/main/public/button.json"),n=Object(r.a)(t,1)[0],c=Object(i.useState)([]),s=Object(r.a)(c,2),a=s[0],o=s[1];Object(i.useEffect)((function(){n&&function(){var e=Object(g.a)(O.a.mark((function e(){var t,i;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(n);case 2:return t=e.sent,e.next=5,t.json();case 5:i=e.sent,o(i.buttList);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()().catch(console.log)}),[n]);var l=a.map((function(t){return function(t){return Object(h.jsx)(v,{className:t.class,id:t.id,keyCode:t.keyCode,desc:t.desc,handleEvent:e.handleEvent},t.id)}(t)}));return Object(h.jsx)("div",{id:"calcPad",children:l})},w=function(e){var t={position:"absolute",top:"".concat(Math.max((e.h-540)/2+40,40),"px")};return Object(h.jsxs)("div",{id:"calc",style:e.w>900?Object(o.a)({},{position:"relative",marginLeft:"100px"}):Object(o.a)({},t),children:[Object(h.jsx)(b,{op1:e.op1,oper:e.oper,op2:e.op2,res:e.res,hist:e.hist}),Object(h.jsx)(x,{handleEvent:e.handleEvent})]})},m={precision:22},y=Object(l.a)(d.a,m),S=function(e){var t=Object(i.useState)(""),n=Object(r.a)(t,2),c=n[0],s=n[1],a=Object(i.useState)(""),l=Object(r.a)(a,2),d=l[0],u=l[1],f=Object(i.useState)("0"),b=Object(r.a)(f,2),p=b[0],O=b[1],g=Object(i.useState)(!1),v=Object(r.a)(g,2),x=v[0],m=v[1],S=Object(i.useState)(""),k=Object(r.a)(S,2),E=k[0],C=k[1],N=Object(i.useState)(!1),P=Object(r.a)(N,2),L=P[0],M=P[1],H=Object(i.useState)([]),q=Object(r.a)(H,2),z=q[0],D=q[1],I={width:"900px",height:"500px",display:"flex",top:"".concat(Math.max((e.h-500)/2,0),"px"),left:"".concat(Math.max((e.w-900)/2,0),"px")},J=function(e,t,n,i){var c=function(){var e=new Date;return e.getMilliseconds().toString(16)+e.getDate().toString(16)+e.getMinutes().toString(16)}();z.length>=13?D(z.concat([[e,t,n,i,c]]).slice(1)):D(z.concat([[e,t,n,i,c]]))},B=function(e,t,n){if("infinity"===e||"infinity"===t)return"infinity";var i=y.bignumber(e),c=y.bignumber(t),s="";return"+"===n?s=y.add(i,c).toString():"-"===n?s=y.subtract(i,c).toString():"*"===n?s=y.multiply(i,c).toString():"/"===n?s="0"===t?"undefined":y.divide(i,c).toString():"%"===n&&(s=y.mod(i,c).toString()),s.length>28?"infinity":s},K=function(e){""!==E||"undefined"===p||"infinity"===p?(s(""),u(""),C(""),M(!1),"."===e?(O("0."),m(!0)):(O(e),m(!1))):p.length-(x?1:0)-(L?2:0)<22&&("0"===e?(0===p.length||x||"0"!==p[0])&&O(p.concat(e)):"."===e?0===p.length?(m(!0),O(p.concat("0."))):x||L||(m(!0),O(p.concat("."))):/[1-9]/.test(e)&&(p.length>0&&!x&&"0"===p[0]?O(e):O(p.concat(e))))},R=function(e){if("undefined"===E||"infinity"===E||"undefined"===p||"infinity"===p)s(""),u(""),O("0"),C(""),m(!1),M(!1);else if(""!==E){s(E),u(e),O(""),C(""),m(!1),M(!1)}else if(""===d){if(p.length>0&&"-"!==p[p.length-1])if(!L||"+"!==p[p.length-1])s(p),u(e),O(""),C(""),m(!1),M(!1)}else if(0===p.length||"-"===p[p.length-1])"-"===e?W():(u(e),O(""));else if((!L||"+"!==p[p.length-1])&&"-"!==p[p.length-1]){var t=d,n=c,i=p,r=B(n,i,t);s(r),u(e),O(""),C(""),m(!1),M(!1),J(n,t,i,r)}},T=function(){if(""===E&&c.length>0&&""!==d&&p.length>0&&(!L||"+"!==p[p.length-1])&&"-"!==p[p.length-1]){var e=B(c,p,d);C(e),J(c,d,p,e)}},W=function(){""!==E||"undefined"===p||"infinity"===p?(s(""),u(""),O("-"),C(""),m(!1),M(!1)):p.length>0?"-"!==p[0]?O("-".concat(p)):O(p.slice(1)):O("-")},A=function(){if(""===E&&p.length>0&&"undefined"!==p&&"infinity"!==p)if(L){var e=p.slice(0,p.indexOf("e"));O(e),M(!1)}else("0"!==p[0]||x&&p.length>2||!L)&&(O(p.concat("e+")),M(!0))},F=function(e){if(""!==E&&"undefined"!==E&&"infinity"!==E){var t=y.bignumber(E);t="sqrt"===e?y.sqrt(t).toString():y.pow(t,2).toString(),s(""),u(""),O(t),C(""),m(t.includes(".")),M(t.includes("e"))}else if(p.length>0&&"undefined"!==p&&"infinity"!==p){var n=y.bignumber(p);if("sqrt"===e){var i=y.sqrt(n).toString();O(i.length>28?"infinity":i),M(i.includes("e"))}else{var c=y.pow(n,2).toString();O(c.length>28?"infinity":c),M(c.includes("e"))}}},G=function(e){if("ac"===e)s(""),u(""),O("0"),C(""),m(!1),M(!1);else if(c.length>0&&p.length>0){var t=d;s(c),u(t),O(""),C(""),m(!1),M(!1)}else if(c.length>0&&d){var n=c;s(""),u(""),O(n),C(""),M(/e\+/i.test(n)),m(/\./.test(n))}else O("")},Q=function(){if(""===E)if(p.length>0)"+"===p[p.length-1]?(O(p.slice(0,p.length-2)),M(!1)):"."===p[p.length-1]?(O(p.slice(0,p.length-1)),m(!1)):O(p.slice(0,p.length-1));else if(c.length>0&&d){var e=c;s(""),u(""),O(e),C(""),M(/e\+/i.test(e)),m(/\./.test(e))}};return Object(h.jsxs)("div",{id:"core",style:e.w>900?Object(o.a)({},I):Object(o.a)({},{width:"400px",height:"100%",margin:"0 auto"}),children:[Object(h.jsx)(j,{hist:z,h:e.h,w:e.w,handleHist:function(e){var t=z[e];s(t[0]),u(t[1]),O(t[2]),C(t[3])},handlePow:e.handlePow,power:e.power}),Object(h.jsx)(w,{h:e.h,w:e.w,op1:c,oper:d,op2:p,res:E,hist:z,handleEvent:function(t){e.power&&(1===t.length?"="===t?T():"e"===t?A():/[\d.]/.test(t)?K(t):R(t):2===t.length?G(t):"bksp"===t?Q():"sign"===t?W():F(t))}})]})},k=function(){var e=a(),t=e.h,n=e.w,c=Object(i.useState)(!0),s=Object(r.a)(c,2),o=s[0],l=s[1],d=function(e){l("boolean"===typeof e?e:!o)};return Object(i.useEffect)((function(){n<=900||l(!0)}),[n]),Object(h.jsxs)("div",{id:"app",children:[Object(h.jsx)(S,{handlePow:d,power:o,h:t,w:n}),Object(h.jsx)("div",{id:"drop",style:{display:o?"none":"block"},onClick:function(){return d(!0)}})]})};n(47);s.a.render(Object(h.jsx)(k,{}),document.getElementById("root"))}},[[48,1,2]]]);
//# sourceMappingURL=main.8978110d.chunk.js.map