'use strict';

const dFactory = name => (props, children) => ({
  type: 'DOMNode',
  tagName: name.toUpperCase(),
  events: props && props.events || {},
  attrs: props && props.attrs || {},
  children: children || [],
});
// node names list blatantly stolen from react
const nodeNames = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];
const d = nodeNames.map(n => ({ [n]: dFactory(n) })).reduce((a, b) => Object.assign(a, b));
const t = content => ({ type: 'TextNode', content });

const createUpdater = actionUpdates => (state, action, payload) => {
  if (typeof actionUpdates[action] === 'function') {
    return actionUpdates[action](state, payload);
  } else if (typeof actionUpdates[action] !== 'undefined') {
    throw new Error(`Expected a function for action ${action.toString()} but ` +
                    `got '${actionUpdates[action]}.'`);
  } else {
    return state;
  }
};

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
    for (let i = 0, oldc, nextc; (oldc = vDOM.children[i]) && (nextc = nextDOM.children[i]); i++) {
      updateDOM(el.childNodes[i], oldc, nextc);
    }
    for (let i = vDOM.children.length, nextc; nextc = nextDOM.children[i]; i++) {
      if (nextc.type === 'TextNode') {
        el.appendChild(document.createTextNode(nextc.content));
      } else {
        el.appendChild(document.createElement(nextc.tagName));
        updateDOM(el.lastChild, dFactory(nextc.tagName)(), nextc);
      }
    }
    for (let i = nextDOM.children.length; i < vDOM.children.length; i++) {
      el.removeChild(el.lastChild);
    }
  } else {
    throw new Error(`Unknown tree type for ${JSON.stringify(nextDOM)}`);
  }
  return el;
}

function render(Component, initialState, actionUpdates, el) {
  const reducer = createUpdater(actionUpdates);
  let state = initialState,
      vDOM = dFactory('')();

  const dispatch = (action, payload) => {
    state = reducer(state, action, payload);
    el = updateDOM(el, vDOM, vDOM = Component(state, dispatch));
  };

  dispatch();
}
