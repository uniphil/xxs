(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dFactory = function dFactory(name) {
  return function (props, children) {
    if (props && Array.isArray(props)) {
      throw new Error('Expected an Object for props but found an Array: \'' + JSON.stringify(props) + '\'\nDid you forget to put an empty \'{}\' for props before the child array?');
    }
    if (props && Object.keys(props).some(function (k) {
      return ['events', 'attrs'].indexOf(k) === -1;
    })) {
      throw new Error('Invalid key found in props {' + Object.keys(props).join(': ..., ') + ': ...} for DOMNode \'' + name + '\'\nOnly \'attrs\' and \'events\' are allowed -- did you forget to nest your attribute or event inside one of those?');
    }
    if (children && !Array.isArray(children)) {
      throw new Error('Expected an Array for children but found ' + JSON.stringify(children));
    }
    return {
      type: 'DOMNode',
      tagName: name.toUpperCase(),
      events: props && props.events || {},
      attrs: props && props.attrs || {},
      children: children || []
    };
  };
};
// node names list blatantly stolen from react
var nodeNames = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];
var d = nodeNames.map(function (n) {
  return _defineProperty({}, n, dFactory(n));
}).reduce(function (a, b) {
  return Object.assign(a, b);
});
var t = function t(content) {
  return { type: 'TextNode', content: content };
};

function createUpdater(actionUpdates) {
  Object.getOwnPropertySymbols(actionUpdates).concat(Object.keys(actionUpdates)).filter(function (k) {
    return typeof actionUpdates[k] !== 'function';
  }).forEach(function (k) {
    throw new Error('Expected a function for action \'' + k.toString() + '\' but found \'' + actionUpdates[k].toString() + '\'');
  });
  return function (state, action, payload) {
    return (actionUpdates[action] || function (x) {
      return x;
    })(state, payload);
  };
}

function updateDOM(el, vDOM, nextDOM) {
  if (nextDOM.type === 'TextNode') {
    el.parentElement.replaceChild(document.createTextNode(nextDOM.content), el);
  } else if (nextDOM.type === 'DOMNode') {
    if (vDOM.type !== 'DOMNode' || vDOM.type === 'DOMNode' && vDOM.tagName !== nextDOM.tagName) {
      var nextEl = document.createElement(nextDOM.tagName);
      el.parentElement.replaceChild(nextEl, el);
      el = nextEl;
      vDOM = dFactory(nextDOM.tagName)();
    }
    Object.keys(vDOM.events).forEach(function (evt) {
      return el.removeEventListener(evt, vDOM.events[evt]);
    });
    Object.keys(nextDOM.events).forEach(function (evt) {
      return el.addEventListener(evt, nextDOM.events[evt]);
    });
    Object.keys(vDOM.attrs).forEach(function (attr) {
      return attr === 'value' ? el.value = '' : el.removeAttribute(attr);
    });
    Object.keys(nextDOM.attrs).forEach(function (attr) {
      return attr === 'value' ? el.value = nextDOM.attrs[attr] : el.setAttribute(attr, nextDOM.attrs[attr]);
    });
    for (var i = 0, oldc, nextc; (oldc = vDOM.children[i]) && (nextc = nextDOM.children[i]); i++) {
      updateDOM(el.childNodes[i], oldc, nextc);
    }
    for (var i = vDOM.children.length; i < nextDOM.children.length; i++) {
      var _nextc = nextDOM.children[i];
      if (_nextc.type === 'TextNode') {
        el.appendChild(document.createTextNode(_nextc.content));
      } else if (_nextc.type === 'DOMNode') {
        el.appendChild(document.createElement(_nextc.tagName));
        updateDOM(el.lastChild, dFactory(_nextc.tagName)(), _nextc);
      } else {
        throw new Error('Unknown node type for node: ' + JSON.stringify(_nextc));
      }
    }
    for (var i = nextDOM.children.length; i < vDOM.children.length; i++) {
      el.removeChild(el.lastChild);
    }
  } else {
    throw new Error('Unknown tree type for ' + JSON.stringify(nextDOM));
  }
  return el;
}

function render(Component, initialState, updater, el) {
  var state = initialState,
      dispatching,
      dirty = false,
      vDOM = dFactory(el.tagName)();

  var dispatch = (function dispatch(action, payload) {
    if (dispatching) {
      throw new Error('\'' + action.toString() + '\' was dispatched while \'' + dispatching.toString() + '\' was still updating. Updaters should be pure functions and must not dispatch actions.');
    }
    try {
      dispatching = action;
      state = updater(state, action, payload);
    } finally {
      dispatching = null;
    }
    updateUI();
    return dispatch;
  })();

  function updateUI() {
    if (dirty) {
      return;
    } // RAF already queued
    dirty = true;
    requestAnimationFrame(function () {
      try {
        el = updateDOM(el, vDOM, vDOM = Component(state, dispatch));
      } finally {
        dirty = false;
      }
    });
  };
}

module.exports = { d: d, t: t, createUpdater: createUpdater, render: render };

},{}]},{},[1]);
