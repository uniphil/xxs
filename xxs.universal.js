(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
'use strict'

/**
 * domFactory args:
 * @param {string} name the tagName of the DOM node to make a factory for
 * Returned function args:
 * @param {object} props An object with all events and attributes to set on
 * @param {object} props.attrs Attributes to set with Element.setAttribute(),
 *   though note that `value` is special is directly assigned to the element
 * @param {object} props.events Event handler functions to attach
 * @param {object[]} children children to appendChild on this element, as
 *   Virtual DOM nodes like those returned by this function
 * @returns {object} A Virtual DOM node specifying this node
 */
;
var domFactory = function domFactory(name) {
  return function (props, children) {
    if (process.env.NODE_ENV !== 'production') {
      // it's easy to forget an empty {} if no props are needed
      if (props && Array.isArray(props)) {
        throw new Error('Expected an Object for props but found an Array: \'' + JSON.stringify(props) + '\'\nDid you forget to put an empty \'{}\' for props before the child array?');
      }
      // props only has two valid keys, so catch any typos here
      if (props && Object.keys(props).some(function (k) {
        return ['events', 'attrs'].indexOf(k) === -1;
      })) {
        throw new Error('Invalid key found in props {' + Object.keys(props).join(': ..., ') + ': ...} for DOMNode \'' + name + '\'\nOnly \'attrs\' and \'events\' are allowed -- did you forget to nest your attribute or event inside one of those?');
      }
      // single children (even text nodes) still need to be wrapped in an array, but I mess this up constantly
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

// Make factories for all valid tagNames. This list is blatantly stolen from React.
var d = {};['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (n) {
  return d[n] = domFactory(n);
});

/**
 * Text node factory
 * @param {string} content The content of the TextNode
 * @returns {object} A Virtual DOM text node
 */
var t = function t(content) {
  return { type: 'TextNode', content: content };
};

/**
 * A helper to generate updater functions mapped by action
 * @param {object} actionUpdates An object with Actions (strings or symbols) as
 *   keys and ((state, payload) => nextState) functions as values
 * @returns {function} An updater function ((state, action, payload) => nextState)
 */
function createUpdater(actionUpdates) {
  if (process.env.NODE_ENV !== 'production') {
    // Ensure that all values are functions
    Object.getOwnPropertySymbols(actionUpdates).concat(Object.keys(actionUpdates)).filter(function (k) {
      return typeof actionUpdates[k] !== 'function';
    }).forEach(function (k) {
      throw new Error('Expected a ((state, payload) => state) function for action \'' + k.toString() + '\' but found \'' + actionUpdates[k].toString() + '\'');
    });
  }
  // If we have this action as a key, call it's value to update state, otherwise
  // pass through the state.
  return function (state, action, payload) {
    return actionUpdates[action] ? actionUpdates[action](state, payload) : state;
  };
}

/**
 * The simplest (and worst) DOM updater I can come up with :)
 * Takes the brute-force approach of walking the whole DOM tree, remving all
 * attributes and events that were declared at the last render, and adding all
 * that were declared for this render. Yes, most of the time this will remove
 * and re-add exactly the same things. Do any browsers see ths and optimize it?
 * @param {DOMNode} el An actual real DOM node to update
 * @param {vDOMNode} vDOM the current (previous, stale) Virtual DOM spec
 * @param {vDOMNode} nextDOM the next VirtualDOM spec we want el to match when
 *   this function is done.
 * @returns {DOMNode} A ref to the updated DOMNode
 */
function updateDOM(el, vDOM, nextDOM) {
  // Ensure our next vDOMNode is of a valid type
  if (process.env.NODE_ENV !== 'production' && !(nextDOM.type in ['DOMNode', 'TextNode'])) {
    throw new Error('Unknown vDOMNode.type for ' + JSON.stringify(nextDOM));
  }

  if (nextDOM.type === 'TextNode') {
    // replace the current node with a new textNode
    el.parentElement.replaceChild(document.createTextNode(nextDOM.content), el);
  } else {
    if (vDOM.type !== 'DOMNode' || vDOM.tagName !== nextDOM.tagName) {
      // if we have a different kind of node, remove the old and empty vDOM's spec
      el.parentElement.replaceChild(el = document.createElement(nextDOM.tagName), el);
      vDOM = domFactory(nextDOM.tagName)();
    }

    // brute-force remove/add all attributes and event listeners
    Object.keys(vDOM.events).forEach(function (evt) {
      return el.removeEventListener(evt, vDOM.events[evt]);
    });
    Object.keys(nextDOM.events).forEach(function (evt) {
      return el.addEventListener(evt, nextDOM.events[evt]);
    });
    Object.keys(vDOM.attrs).forEach(function (attr) {
      return attr === 'value' ? el.value = '' // value is special and must be assigned directly
      : el.removeAttribute(attr);
    });
    Object.keys(nextDOM.attrs).forEach(function (attr) {
      return attr === 'value' ? el.value = nextDOM.attrs[attr] : el.setAttribute(attr, nextDOM.attrs[attr]);
    });

    // Update children in place
    for (var i = 0; i < vDOM.children.length && i < nextDOM.children.length; i++) {
      updateDOM(el.childNodes[i], vDOM.children[i], nextDOM.children[i]);
    }
    // if there are new chlidren to add, add them
    for (var i = vDOM.children.length; i < nextDOM.children.length; i++) {
      var nextc = nextDOM.children[i];
      if (nextc.type === 'TextNode') {
        el.appendChild(document.createTextNode(nextc.content));
      } else if (nextc.type === 'DOMNode') {
        el.appendChild(document.createElement(nextc.tagName));
        updateDOM(el.lastChild, domFactory(nextc.tagName)(), nextc);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error('Unknown node type for node: ' + JSON.stringify(nextc));
      }
    }
    // if there are extra children to remove, remove them
    for (var i = nextDOM.children.length; i < vDOM.children.length; i++) {
      el.removeChild(el.lastChild);
    }
  }
  return el;
}

/**
 * @param {function} Component ((state, dispatch) => vDOMNode)
 * @param {any} initialState The first state to render Component with
 * @param {function} updater ((state, action, payload) => nextState)
 * @returns {void}
 */
function render(Component, initialState, updater, el) {
  var state = initialState,
      dispatching,
      // guard against updaters trying to dispatch
  dirty = false,
      // guard against queuing more RAFs when one is already queued
  vDOM = domFactory(el.tagName)(); // dummy spec for the node we're attaching to

  /**
   * @param {Symbol|string} action? The action to dispatch (or undefined to force a render)
   * @param {any} payload? Any data associated with the action
   * @returns {void}
   */
  function dispatch(action, payload) {
    if (process.env.NODE_ENV !== 'production' && dispatching) {
      throw new Error('\'' + action.toString() + '\' was dispatched while \'' + dispatching.toString() + '\' was still updating. Updaters should be pure functions and must not dispatch actions.');
    }
    try {
      dispatching = action;
      state = updater(state, action, payload);
    } finally {
      dispatching = null;
    }
    updateUI();
  };

  /**
   * Queue a UI update if one isn't already queued
   * @returns {void}
   */
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

  // kick it off!
  dispatch();
}

module.exports = { d: d, t: t, createUpdater: createUpdater, render: render };

}).call(this,require('_process'))
},{"_process":1}]},{},[2]);
