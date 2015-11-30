(function(exports, global) {
  'use strict';
  var domFactory = function domFactory(name) {
    return function(props, children) {
      if (true) {
        if (props && Array.isArray(props)) {
          throw new Error('Expected an Object for props but found an Array: \'' + JSON.stringify(props) + '\'\nDid you forget to put an empty \'{}\' for props before the child array?');
        }
        if (props && Object.keys(props).some(function(k) {
          return [ 'events', 'attrs' ].indexOf(k) === -1;
        })) {
          throw new Error('Invalid key found in props {' + Object.keys(props).join(': ..., ') + ': ...} for DOMNode \'' + name + '\'\nOnly \'attrs\' and \'events\' are allowed -- did you forget to nest your attribute or event inside one of those?');
        }
        if (children && !Array.isArray(children)) {
          throw new Error('Expected an Array for children but found ' + JSON.stringify(children) + '. Did you forget to wrap a single child in an array?');
        }
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
  var d = {};
  [ 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr' ].forEach(function(n) {
    return d[n] = domFactory(n);
  });
  var t = function t(content) {
    return {
      type: 'TextNode',
      content: content
    };
  };
  function createUpdater(actionUpdates) {
    if (true) {
      Object.getOwnPropertySymbols(actionUpdates).concat(Object.keys(actionUpdates)).filter(function(k) {
        return typeof actionUpdates[k] !== 'function';
      }).forEach(function(k) {
        throw new Error('Expected a ((state, payload) => state) function for action \'' + k.toString() + '\' but found \'' + actionUpdates[k].toString() + '\'');
      });
    }
    return function(state, action, payload) {
      return actionUpdates[action] ? actionUpdates[action](state, payload) : state;
    };
  }
  function updateDOM(el, vDOM, nextDOM) {
    if (true && !(nextDOM.type in {
      DOMNode: 0,
      TextNode: 0
    })) {
      throw new Error('Unknown vDOMNode.type for ' + JSON.stringify(nextDOM));
    }
    if (nextDOM.type === 'TextNode') {
      el.parentElement.replaceChild(document.createTextNode(nextDOM.content), el);
    } else {
      if (vDOM.type !== 'DOMNode' || vDOM.tagName !== nextDOM.tagName) {
        var nextEl = document.createElement(nextDOM.tagName);
        el.parentElement.replaceChild(nextEl, el);
        el = nextEl;
        vDOM = domFactory(nextDOM.tagName)();
      }
      Object.keys(vDOM.events).forEach(function(evt) {
        return el.removeEventListener(evt, vDOM.events[evt]);
      });
      Object.keys(nextDOM.events).forEach(function(evt) {
        return el.addEventListener(evt, nextDOM.events[evt]);
      });
      Object.keys(vDOM.attrs).filter(function(attr) {
        return !(attr in nextDOM.attrs);
      }).forEach(function(attr) {
        return el.removeAttribute(attr);
      });
      Object.keys(nextDOM.attrs).filter(function(attr) {
        return attr !== 'value';
      }).filter(function(attr) {
        return nextDOM.attrs[attr] !== vDOM.attrs[attr];
      }).forEach(function(attr) {
        return el.setAttribute(attr, nextDOM.attrs[attr]);
      });
      if (nextDOM.attrs.hasOwnProperty('value') && nextDOM.attrs.value !== el.value) {
        el.value = nextDOM.attrs.value;
      }
      for (var i = 0; i < vDOM.children.length && i < nextDOM.children.length; i++) {
        updateDOM(el.childNodes[i], vDOM.children[i], nextDOM.children[i]);
      }
      for (var i = vDOM.children.length; i < nextDOM.children.length; i++) {
        var nextc = nextDOM.children[i];
        if (nextc.type === 'TextNode') {
          el.appendChild(document.createTextNode(nextc.content));
        } else if (nextc.type === 'DOMNode') {
          el.appendChild(document.createElement(nextc.tagName));
          updateDOM(el.lastChild, domFactory(nextc.tagName)(), nextc);
        } else if (true) {
          throw new Error('Unknown node type for node: ' + JSON.stringify(nextc));
        }
      }
      for (var i = nextDOM.children.length; i < vDOM.children.length; i++) {
        el.removeChild(el.lastChild);
      }
    }
    return el;
  }
  function render(Component, initialState, updater, el, debug) {
    var state = initialState, dispatching, dirty = false, vDOM = domFactory(el.tagName)();
    function dispatch(action, payload) {
      if (true && dispatching) {
        throw new Error('\'' + action.toString() + '\' was dispatched while \'' + dispatching.toString() + '\' was still updating. Updaters should be pure functions and must not dispatch actions.');
      }
      try {
        dispatching = action;
        state = updater(state, action, payload);
        if (true && debug) {
          console.info(state);
        }
      } finally {
        dispatching = null;
      }
      updateUI();
    }
    function updateUI() {
      if (dirty) {
        return;
      }
      dirty = true;
      requestAnimationFrame(function() {
        try {
          el = updateDOM(el, vDOM, vDOM = Component(state, dispatch));
        } finally {
          dirty = false;
        }
      });
    }
    dispatch();
  }
  exports['domFactory'] = domFactory;
  exports['d'] = d;
  exports['t'] = t;
  exports['createUpdater'] = createUpdater;
  exports['updateDOM'] = updateDOM;
  exports['render'] = render;
  global['xxs'] = exports;
})({}, function() {
  return this;
}());
