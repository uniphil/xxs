'use strict';

const dFactory = name => (props, children) => {
  if (props && Array.isArray(props)) {
    throw new Error(`Expected an Object for props but found an Array: '${JSON.stringify(props)}'\nDid you forget to put an empty '{}' for props before the child array?`);
  }
  if (props && Object.keys(props).some(k => ['events', 'attrs'].indexOf(k) === -1)) {
    throw new Error(`Invalid key found in props {${Object.keys(props).join(': ..., ')}: ...} for DOMNode '${name}'\nOnly 'attrs' and 'events' are allowed -- did you forget to nest your attribute or event inside one of those?`);
  }
  if (children && !Array.isArray(children)) {
    throw new Error(`Expected an Array for children but found ${JSON.stringify(children)}`);
  }
  return {
    type: 'DOMNode',
    tagName: name.toUpperCase(),
    events: props && props.events || {},
    attrs: props && props.attrs || {},
    children: children || [],
  };
};
// node names list blatantly stolen from react
const nodeNames = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];
const d = nodeNames.map(n => ({ [n]: dFactory(n) })).reduce((a, b) => Object.assign(a, b));
const t = content => ({ type: 'TextNode', content });

function createUpdater(actionUpdates) {
  Object.getOwnPropertySymbols(actionUpdates).concat(Object.keys(actionUpdates))
    .filter(k => typeof actionUpdates[k] !== 'function')
    .forEach(k => { throw new Error(`Expected a function for action '${k.toString()}' but found '${actionUpdates[k].toString()}'`); });
  return (state, action, payload) =>
    (actionUpdates[action] || (x => x))(state, payload);
}

function updateDOM(el, vDOM, nextDOM) {
  if (nextDOM.type === 'TextNode') {
    el.parentElement.replaceChild(document.createTextNode(nextDOM.content), el);
  } else if (nextDOM.type ==='DOMNode') {
    if (vDOM.type !== 'DOMNode' || ( vDOM.type === 'DOMNode' && vDOM.tagName !== nextDOM.tagName )) {
      const nextEl = document.createElement(nextDOM.tagName);
      el.parentElement.replaceChild(nextEl, el);
      el = nextEl;
      vDOM = dFactory(nextDOM.tagName)();
    }
    Object.keys(vDOM.events).forEach(evt => el.removeEventListener(evt, vDOM.events[evt]));
    Object.keys(nextDOM.events).forEach(evt => el.addEventListener(evt, nextDOM.events[evt]));
    Object.keys(vDOM.attrs).forEach(attr => attr === 'value'
      ? el.value = ''
      : el.removeAttribute(attr));
    Object.keys(nextDOM.attrs).forEach(attr => attr === 'value'
      ? el.value = nextDOM.attrs[attr]
      : el.setAttribute(attr, nextDOM.attrs[attr]));
    for (var i = 0, oldc, nextc; (oldc = vDOM.children[i]) && (nextc = nextDOM.children[i]); i++) {
      updateDOM(el.childNodes[i], oldc, nextc);
    }
    for (var i = vDOM.children.length; i < nextDOM.children.length; i++) {
      const nextc = nextDOM.children[i];
      if (nextc.type === 'TextNode') {
        el.appendChild(document.createTextNode(nextc.content));
      } else if (nextc.type === 'DOMNode') {
        el.appendChild(document.createElement(nextc.tagName));
        updateDOM(el.lastChild, dFactory(nextc.tagName)(), nextc);
      } else {
        throw new Error(`Unknown node type for node: ${JSON.stringify(nextc)}`);
      }
    }
    for (var i = nextDOM.children.length; i < vDOM.children.length; i++) {
      el.removeChild(el.lastChild);
    }
  } else {
    throw new Error(`Unknown tree type for ${JSON.stringify(nextDOM)}`);
  }
  return el;
}

function render(Component, initialState, updater, el) {
  var state = initialState,
      dispatching,
      dirty = false,
      vDOM = dFactory(el.tagName)();

  const dispatch = (function dispatch(action, payload) {
    if (dispatching) {
      throw new Error(`'${action.toString()}' was dispatched while '${dispatching.toString()}' was still updating. Updaters should be pure functions and must not dispatch actions.`);
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
    if (dirty) { return; }  // RAF already queued
    dirty = true;
    requestAnimationFrame(() => {
      try {
        el = updateDOM(el, vDOM, vDOM = Component(state, dispatch));
      } finally {
        dirty = false;
      }
    });
  };
}
