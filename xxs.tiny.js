!function(e,t){"use strict";function n(e){return function(t,n,r){return e[n]?e[n](t,r):t}}function r(e,t,n){if("TextNode"===n.type)e.parentElement.replaceChild(document.createTextNode(n.content),e);else{if("DOMNode"!==t.type||t.tagName!==n.tagName){var a=document.createElement(n.tagName);e.parentElement.replaceChild(a,e),e=a,t=c(n.tagName)()}Object.keys(t.events).forEach(function(n){return e.removeEventListener(n,t.events[n])}),Object.keys(n.events).forEach(function(t){return e.addEventListener(t,n.events[t])}),Object.keys(t.attrs).filter(function(e){return!(e in n.attrs)}).forEach(function(t){return e.removeAttribute(t)}),Object.keys(n.attrs).filter(function(e){return"value"!==e}).filter(function(e){return n.attrs[e]!==t.attrs[e]}).forEach(function(t){return e.setAttribute(t,n.attrs[t])}),n.attrs.hasOwnProperty("value")&&n.attrs.value!==e.value&&(e.value=n.attrs.value);for(var i=0;t.children.length>i&&n.children.length>i;i++)r(e.childNodes[i],t.children[i],n.children[i]);for(var i=t.children.length;n.children.length>i;i++){var u=n.children[i];"TextNode"===u.type?e.appendChild(document.createTextNode(u.content)):"DOMNode"===u.type&&(e.appendChild(document.createElement(u.tagName)),r(e.lastChild,c(u.tagName)(),u))}for(var i=n.children.length;t.children.length>i;i++)e.removeChild(e.lastChild)}return e}function a(e,t,n,a,i){function u(e,t){try{o=e,d=n(d,e,t)}finally{o=null}l()}function l(){s||(s=!0,requestAnimationFrame(function(){try{a=r(a,f,f=e(d,u))}finally{s=!1}}))}var o,d=t,s=!1,f=c(a.tagName)();u()}var c=function(e){return function(t,n){return{type:"DOMNode",tagName:e.toUpperCase(),events:t&&t.events||{},attrs:t&&t.attrs||{},children:n||[]}}},i=function(e){return{type:"TextNode",content:e}};e.d=c,e.t=i,e.createUpdater=n,e.updateDOM=r,e.render=a,t.xxs=e}({},function(){return this}());
