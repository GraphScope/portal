"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[8654],{68654:function(e,n,t){t.r(n),t.d(n,{default:function(){return q}});var i=t(15558),r=t.n(i),a=t(26068),o=t.n(a),s=t(48305),l=t.n(s),c=t(50959),u=t(70049),d=t(47313),p=t(28541),x=t(31192),f=t(57526),g=t(48722),h=t(38943),j=t(73174),S=t(16471),v=t(62950),y=t(2268),b=t(11527),m=function(e){var n=(0,y.useSection)(),t=n.toggleLeftSide,i=n.toggleRightSide;return"right"===e.displaySidebarPosition?(0,b.jsx)(h.ZP,{icon:(0,b.jsx)(y.Icons.Sidebar,{}),onClick:function(){return i()},type:"text"}):"left"===e.displaySidebarPosition?(0,b.jsx)(h.ZP,{icon:(0,b.jsx)(y.Icons.Sidebar,{}),onClick:function(){return t()},type:"text"}):null},Z=t(70667),C=t(14103),k=t(52548),w=t(17905),P=t(52018),R=function(e){e.previewSchema,e.onClick;var n=(0,c.useState)(!1),t=l()(n,2),i=t[0],r=t[1],a=(0,j.qp)(),o=a.updateStore,s=a.store,u=s.schemaData,d=s.language,p=(0,c.useCallback)((function(e){r(!1);var n=[e.MATCHs,e.WHEREs,e.RETURNs].join("\n");o((function(e){e.globalScript=n,e.autoRun=!1}))}),[]),x=(0,c.useCallback)((function(){return i?(0,b.jsx)(k.$E,{onClick:p,previewGraph:JSON.parse(JSON.stringify(u))}):(0,b.jsx)(b.Fragment,{})}),[i]);return"cypher"!==d?null:(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(w.Z,{title:"快速绘制语句",placement:"right",children:(0,b.jsx)(h.ZP,{onClick:function(){r(!0)},type:"text",icon:(0,b.jsx)(C.Z,{})})}),(0,b.jsx)(P.Z,{title:"",centered:!0,open:i,onOk:function(){return r(!1)},onCancel:function(){return r(!1)},width:"90%",footer:null,children:(0,b.jsx)("div",{style:{height:"".concat(.8*window.innerHeight,"px")},children:(0,b.jsx)(x,{})})})]})},E=(u.Z,d.Z,function(){var e=(0,j.qp)(),n=e.updateStore,t=e.store.mode;return(0,b.jsx)(x.Z,{value:t,options:[{icon:(0,b.jsx)(u.Z,{}),value:"tabs"},{icon:(0,b.jsx)(d.Z,{}),value:"flow"}],onChange:function(e){n((function(n){n.mode=e,localStorage.setItem(j.rv.mode,e)}))}})}),I=function(){var e=(0,j.qp)(),n=e.updateStore,t=e.store.language;return(0,b.jsx)(x.Z,{value:t,options:[{label:"Gremlin",value:"gremlin",disabled:"cypher"===t},{label:"Cypher",value:"cypher",disabled:"gremlin"===t}],onChange:function(e){n((function(n){n.language=e}))}})},q=function(e){var n=e.connectComponent,t=e.displaySidebarPosition,i=(0,j.qp)(),a=i.updateStore,s=i.store,u=(0,c.useRef)(null),d=(0,c.useState)({clear:!1}),x=l()(d,2),y=x[0],C=x[1],k=s.globalScript,w=s.autoRun,P=s.language,q=(s.graphId,function(){if(u.current){var e=u.current.codeEditor.getValue();if(""===e)return;a((function(n){n.globalScript="";var t=(0,v.Z)();n.statements=[{id:t,name:t,script:e,language:P}].concat(r()(n.statements)),n.activeId=t})),C((function(e){return o()(o()({},e),{},{clear:!0})}))}}),H=(0,S.Ek)(k);return(0,b.jsxs)("div",{style:{width:"100%",padding:"8px 0px"},children:[(0,b.jsxs)(f.Z,{justify:"space-between",align:"center",children:[(0,b.jsxs)(g.Z,{children:["left"===t&&(0,b.jsx)(m,{displaySidebarPosition:t}),(0,b.jsx)(I,{})]}),n,(0,b.jsxs)(g.Z,{children:[(0,b.jsx)(R,{}),(0,b.jsx)(E,{}),"right"===t&&(0,b.jsx)(m,{displaySidebarPosition:t})]})]}),(0,b.jsxs)(f.Z,{justify:"space-between",style:{marginTop:"8px"},children:[(0,b.jsx)(Z.Z,{language:P,onChangeContent:function(){C((function(e){return o()(o()({},e),{},{clear:!1})}))},value:k,ref:u,maxRows:25,minRows:H,clear:y.clear,onInit:function(){w&&q()}}),(0,b.jsx)("div",{style:{flexBasis:"48px",flexShrink:0},children:(0,b.jsx)(h.ZP,{style:{marginLeft:"10px"},type:"text",icon:(0,b.jsx)(p.Z,{style:{fontSize:"24px"}}),onClick:q,size:"large"})})]})]})}}}]);