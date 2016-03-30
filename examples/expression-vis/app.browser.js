(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _xxs = require('../../xxs');

var _helpers = require('./helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _map = ['div', 'p'].map(_xxs.d);

var _map2 = _slicedToArray(_map, 2);

var div = _map2[0];
var p = _map2[1];

var App = function App(state, dispatch) {
  return div({ attrs: { 'class': 'app' } }, [p({}, [(0, _xxs.t)('hello ' + state.name)])]);
};

var init = {
  name: 'friend'
};

var CHANGE_NAME = Symbol('CHANGE_NAME');

var updater = (0, _xxs.createUpdater)(_defineProperty({}, CHANGE_NAME, function (state, payload) {
  return _helpers.o.set(state, 'name', payload);
}));

var dispatch = (0, _xxs.render)(App, init, updater, document.getElementById('app'));

},{"../../xxs":4,"./helpers":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var o = exports.o = {
  update: function update(obj, toMerge) {
    return Object.assign({}, obj, toMerge);
  },
  set: function set(obj, key, val) {
    return o.update(obj, _defineProperty({}, key, val));
  }
};

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function (process){
'use strict'

/**
 * d args:
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
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUpdater = createUpdater;
exports.render = render;
var d = exports.d = function d(name) {
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

/**
 * Text node factory
 * @param {string} content The content of the TextNode
 * @returns {object} A Virtual DOM text node
 */
var t = exports.t = function t(content) {
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
  if (process.env.NODE_ENV !== 'production' && !(nextDOM.type in { DOMNode: 0, TextNode: 0 })) {
    throw new Error('Unknown vDOMNode.type for ' + JSON.stringify(nextDOM));
  }

  if (nextDOM.type === 'TextNode') {
    // replace the current node with a new textNode
    el.parentElement.replaceChild(document.createTextNode(nextDOM.content), el);
  } else {
    if (vDOM.type !== 'DOMNode' || vDOM.tagName !== nextDOM.tagName) {
      // if we have a different kind of node, remove the old and empty vDOM's spec
      var nextEl = document.createElement(nextDOM.tagName);
      el.parentElement.replaceChild(nextEl, el);
      el = nextEl;
      vDOM = d(nextDOM.tagName)();
    }

    // brute-force remove/add all event listeners
    Object.keys(vDOM.events).forEach(function (evt) {
      return el.removeEventListener(evt, vDOM.events[evt]);
    });
    Object.keys(nextDOM.events).forEach(function (evt) {
      return el.addEventListener(evt, nextDOM.events[evt]);
    });
    // actually diff the attributes because otherwise there are weird side-effects in FF :(
    Object.keys(vDOM.attrs).filter(function (attr) {
      return !(attr in nextDOM.attrs);
    }).forEach(function (attr) {
      return el.removeAttribute(attr);
    }); // .value is a silent failure we can ignore
    Object.keys(nextDOM.attrs).filter(function (attr) {
      return attr !== 'value';
    }).filter(function (attr) {
      return nextDOM.attrs[attr] !== vDOM.attrs[attr];
    }).forEach(function (attr) {
      return el.setAttribute(attr, nextDOM.attrs[attr]);
    });
    if (nextDOM.attrs.hasOwnProperty('value') && nextDOM.attrs.value !== el.value) {
      el.value = nextDOM.attrs.value;
    }

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
        updateDOM(el.lastChild, d(nextc.tagName)(), nextc);
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
 * @param {Element} el The DOM node to mount the app at
 * @param {func[]} middlewares next => (state, action, payload) => state
 * @returns {void}
 */
function render(Component, initialState, updater, el) {
  var middlewares = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

  var state = initialState,
      dispatching,
      // guard against updaters trying to dispatch
  dirty = false,
      // guard against queuing more RAFs when one is already queued
  vDOM = d(el.tagName)(); // dummy spec for the node we're attaching to
  var mwUpdater = middlewares.reduceRight(function (next, mw) {
    return mw(next);
  }, updater);

  /**
   * @param {Symbol|string} action? The action to dispatch (or undefined to force a render)
   * @param {any} payload? Any data associated with the action
   * @returns {void}
   */
  function dispatch(action, payload) {
    console.info(action);
    if (process.env.NODE_ENV !== 'production' && dispatching) {
      throw new Error('\'' + action.toString() + '\' was dispatched while \'' + dispatching.toString() + '\' was still updating. Updaters should be pure functions and must not dispatch actions.');
    }
    try {
      dispatching = action;
      state = mwUpdater(state, action, payload);
      console.info('>', state);
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

  // give back a dispatch ref, so we can hook things up to make actions outside
  // of components
  return dispatch;
}

}).call(this,require('_process'))

},{"_process":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJoZWxwZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi4uLy4uL3h4cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7V0NFbUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUYxQixDQUFDLENBRTRCOzs7O0lBQTlCLEdBQUc7SUFBRSxDQUFDOztBQUdkLElBQU0sR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLEtBQUssRUFBRSxRQUFRO1NBQzFCLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQ2pDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxTQVBDLENBQUMsYUFPUyxLQUFLLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQyxDQUNsQyxDQUFDO0NBQUEsQ0FBQzs7QUFHTCxJQUFNLElBQUksR0FBRztBQUNYLE1BQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQzs7QUFHRixJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRzFDLElBQU0sT0FBTyxHQUFHLFNBbkJELGFBQWEsc0JBb0J6QixXQUFXLEVBQUcsVUFBQyxLQUFLLEVBQUUsT0FBTztTQUFLLFNBbkI1QixDQUFDLENBbUI2QixHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7Q0FBQSxFQUNoRSxDQUFDOztBQUdILElBQU0sUUFBUSxHQUFHLFNBeEJhLE1BQU0sRUF3QlosR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQ3hC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R0FDSjs7O0FBQUMsQUFHRixVQUFRLEVBQUU7Ozs7QUFBQyxBQUlYLFNBQU8sUUFBUSxDQUFDO0NBQ2pCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IGQsIHQsIGNyZWF0ZVVwZGF0ZXIsIHJlbmRlciB9IGZyb20gJy4uLy4uL3h4cyc7XG5pbXBvcnQgeyBvIH0gZnJvbSAnLi9oZWxwZXJzJztcbmNvbnN0IFsgZGl2LCBwIF0gPSBbJ2RpdicsICdwJ10ubWFwKGQpO1xuXG5cbmNvbnN0IEFwcCA9IChzdGF0ZSwgZGlzcGF0Y2gpID0+XG4gIGRpdih7IGF0dHJzOiB7ICdjbGFzcyc6ICdhcHAnIH0gfSwgW1xuICAgIHAoe30sIFt0KGBoZWxsbyAke3N0YXRlLm5hbWV9YCldKSxcbiAgXSk7XG5cblxuY29uc3QgaW5pdCA9IHtcbiAgbmFtZTogJ2ZyaWVuZCcsXG59O1xuXG5cbmNvbnN0IENIQU5HRV9OQU1FID0gU3ltYm9sKCdDSEFOR0VfTkFNRScpO1xuXG5cbmNvbnN0IHVwZGF0ZXIgPSBjcmVhdGVVcGRhdGVyKHtcbiAgW0NIQU5HRV9OQU1FXTogKHN0YXRlLCBwYXlsb2FkKSA9PiBvLnNldChzdGF0ZSwgJ25hbWUnLCBwYXlsb2FkKSxcbn0pO1xuXG5cbmNvbnN0IGRpc3BhdGNoID0gcmVuZGVyKEFwcCwgaW5pdCwgdXBkYXRlciwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTtcbiIsImV4cG9ydCBjb25zdCBvID0ge1xuICB1cGRhdGUob2JqLCB0b01lcmdlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG9iaiwgdG9NZXJnZSk7XG4gIH0sXG4gIHNldChvYmosIGtleSwgdmFsKSB7XG4gICAgcmV0dXJuIG8udXBkYXRlKG9iaiwgeyBba2V5XTogdmFsIH0pO1xuICB9LFxufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIGQgYXJnczpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSB0YWdOYW1lIG9mIHRoZSBET00gbm9kZSB0byBtYWtlIGEgZmFjdG9yeSBmb3JcbiAqIFJldHVybmVkIGZ1bmN0aW9uIGFyZ3M6XG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgQW4gb2JqZWN0IHdpdGggYWxsIGV2ZW50cyBhbmQgYXR0cmlidXRlcyB0byBzZXQgb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcy5hdHRycyBBdHRyaWJ1dGVzIHRvIHNldCB3aXRoIEVsZW1lbnQuc2V0QXR0cmlidXRlKCksXG4gKiAgIHRob3VnaCBub3RlIHRoYXQgYHZhbHVlYCBpcyBzcGVjaWFsIGlzIGRpcmVjdGx5IGFzc2lnbmVkIHRvIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHMuZXZlbnRzIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zIHRvIGF0dGFjaFxuICogQHBhcmFtIHtvYmplY3RbXX0gY2hpbGRyZW4gY2hpbGRyZW4gdG8gYXBwZW5kQ2hpbGQgb24gdGhpcyBlbGVtZW50LCBhc1xuICogICBWaXJ0dWFsIERPTSBub2RlcyBsaWtlIHRob3NlIHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtvYmplY3R9IEEgVmlydHVhbCBET00gbm9kZSBzcGVjaWZ5aW5nIHRoaXMgbm9kZVxuICovXG5leHBvcnQgY29uc3QgZCA9IG5hbWUgPT4gKHByb3BzLCBjaGlsZHJlbikgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIGl0J3MgZWFzeSB0byBmb3JnZXQgYW4gZW1wdHkge30gaWYgbm8gcHJvcHMgYXJlIG5lZWRlZFxuICAgIGlmIChwcm9wcyAmJiBBcnJheS5pc0FycmF5KHByb3BzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhbiBPYmplY3QgZm9yIHByb3BzIGJ1dCBmb3VuZCBhbiBBcnJheTogJyR7SlNPTi5zdHJpbmdpZnkocHJvcHMpfSdcXG5EaWQgeW91IGZvcmdldCB0byBwdXQgYW4gZW1wdHkgJ3t9JyBmb3IgcHJvcHMgYmVmb3JlIHRoZSBjaGlsZCBhcnJheT9gKTtcbiAgICB9XG4gICAgLy8gcHJvcHMgb25seSBoYXMgdHdvIHZhbGlkIGtleXMsIHNvIGNhdGNoIGFueSB0eXBvcyBoZXJlXG4gICAgaWYgKHByb3BzICYmIE9iamVjdC5rZXlzKHByb3BzKS5zb21lKGsgPT4gWydldmVudHMnLCAnYXR0cnMnXS5pbmRleE9mKGspID09PSAtMSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBrZXkgZm91bmQgaW4gcHJvcHMgeyR7T2JqZWN0LmtleXMocHJvcHMpLmpvaW4oJzogLi4uLCAnKX06IC4uLn0gZm9yIERPTU5vZGUgJyR7bmFtZX0nXFxuT25seSAnYXR0cnMnIGFuZCAnZXZlbnRzJyBhcmUgYWxsb3dlZCAtLSBkaWQgeW91IGZvcmdldCB0byBuZXN0IHlvdXIgYXR0cmlidXRlIG9yIGV2ZW50IGluc2lkZSBvbmUgb2YgdGhvc2U/YCk7XG4gICAgfVxuICAgIC8vIHNpbmdsZSBjaGlsZHJlbiAoZXZlbiB0ZXh0IG5vZGVzKSBzdGlsbCBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gYXJyYXksIGJ1dCBJIG1lc3MgdGhpcyB1cCBjb25zdGFudGx5XG4gICAgaWYgKGNoaWxkcmVuICYmICFBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhbiBBcnJheSBmb3IgY2hpbGRyZW4gYnV0IGZvdW5kICR7SlNPTi5zdHJpbmdpZnkoY2hpbGRyZW4pfS4gRGlkIHlvdSBmb3JnZXQgdG8gd3JhcCBhIHNpbmdsZSBjaGlsZCBpbiBhbiBhcnJheT9gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnRE9NTm9kZScsXG4gICAgdGFnTmFtZTogbmFtZS50b1VwcGVyQ2FzZSgpLFxuICAgIGV2ZW50czogcHJvcHMgJiYgcHJvcHMuZXZlbnRzIHx8IHt9LFxuICAgIGF0dHJzOiBwcm9wcyAmJiBwcm9wcy5hdHRycyB8fCB7fSxcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4gfHwgW10sXG4gIH07XG59O1xuXG4vKipcbiAqIFRleHQgbm9kZSBmYWN0b3J5XG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCBUaGUgY29udGVudCBvZiB0aGUgVGV4dE5vZGVcbiAqIEByZXR1cm5zIHtvYmplY3R9IEEgVmlydHVhbCBET00gdGV4dCBub2RlXG4gKi9cbmV4cG9ydCBjb25zdCB0ID0gY29udGVudCA9PiAoeyB0eXBlOiAnVGV4dE5vZGUnLCBjb250ZW50IH0pO1xuXG4vKipcbiAqIEEgaGVscGVyIHRvIGdlbmVyYXRlIHVwZGF0ZXIgZnVuY3Rpb25zIG1hcHBlZCBieSBhY3Rpb25cbiAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb25VcGRhdGVzIEFuIG9iamVjdCB3aXRoIEFjdGlvbnMgKHN0cmluZ3Mgb3Igc3ltYm9scykgYXNcbiAqICAga2V5cyBhbmQgKChzdGF0ZSwgcGF5bG9hZCkgPT4gbmV4dFN0YXRlKSBmdW5jdGlvbnMgYXMgdmFsdWVzXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IEFuIHVwZGF0ZXIgZnVuY3Rpb24gKChzdGF0ZSwgYWN0aW9uLCBwYXlsb2FkKSA9PiBuZXh0U3RhdGUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVcGRhdGVyKGFjdGlvblVwZGF0ZXMpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyBFbnN1cmUgdGhhdCBhbGwgdmFsdWVzIGFyZSBmdW5jdGlvbnNcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGFjdGlvblVwZGF0ZXMpLmNvbmNhdChPYmplY3Qua2V5cyhhY3Rpb25VcGRhdGVzKSlcbiAgICAgIC5maWx0ZXIoayA9PiB0eXBlb2YgYWN0aW9uVXBkYXRlc1trXSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgIC5mb3JFYWNoKGsgPT4geyB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGEgKChzdGF0ZSwgcGF5bG9hZCkgPT4gc3RhdGUpIGZ1bmN0aW9uIGZvciBhY3Rpb24gJyR7ay50b1N0cmluZygpfScgYnV0IGZvdW5kICcke2FjdGlvblVwZGF0ZXNba10udG9TdHJpbmcoKX0nYCk7IH0pO1xuICB9XG4gIC8vIElmIHdlIGhhdmUgdGhpcyBhY3Rpb24gYXMgYSBrZXksIGNhbGwgaXQncyB2YWx1ZSB0byB1cGRhdGUgc3RhdGUsIG90aGVyd2lzZVxuICAvLyBwYXNzIHRocm91Z2ggdGhlIHN0YXRlLlxuICByZXR1cm4gKHN0YXRlLCBhY3Rpb24sIHBheWxvYWQpID0+XG4gICAgYWN0aW9uVXBkYXRlc1thY3Rpb25dID8gYWN0aW9uVXBkYXRlc1thY3Rpb25dKHN0YXRlLCBwYXlsb2FkKSA6IHN0YXRlO1xufVxuXG4vKipcbiAqIFRoZSBzaW1wbGVzdCAoYW5kIHdvcnN0KSBET00gdXBkYXRlciBJIGNhbiBjb21lIHVwIHdpdGggOilcbiAqIFRha2VzIHRoZSBicnV0ZS1mb3JjZSBhcHByb2FjaCBvZiB3YWxraW5nIHRoZSB3aG9sZSBET00gdHJlZSwgcmVtdmluZyBhbGxcbiAqIGF0dHJpYnV0ZXMgYW5kIGV2ZW50cyB0aGF0IHdlcmUgZGVjbGFyZWQgYXQgdGhlIGxhc3QgcmVuZGVyLCBhbmQgYWRkaW5nIGFsbFxuICogdGhhdCB3ZXJlIGRlY2xhcmVkIGZvciB0aGlzIHJlbmRlci4gWWVzLCBtb3N0IG9mIHRoZSB0aW1lIHRoaXMgd2lsbCByZW1vdmVcbiAqIGFuZCByZS1hZGQgZXhhY3RseSB0aGUgc2FtZSB0aGluZ3MuIERvIGFueSBicm93c2VycyBzZWUgdGhzIGFuZCBvcHRpbWl6ZSBpdD9cbiAqIEBwYXJhbSB7RE9NTm9kZX0gZWwgQW4gYWN0dWFsIHJlYWwgRE9NIG5vZGUgdG8gdXBkYXRlXG4gKiBAcGFyYW0ge3ZET01Ob2RlfSB2RE9NIHRoZSBjdXJyZW50IChwcmV2aW91cywgc3RhbGUpIFZpcnR1YWwgRE9NIHNwZWNcbiAqIEBwYXJhbSB7dkRPTU5vZGV9IG5leHRET00gdGhlIG5leHQgVmlydHVhbERPTSBzcGVjIHdlIHdhbnQgZWwgdG8gbWF0Y2ggd2hlblxuICogICB0aGlzIGZ1bmN0aW9uIGlzIGRvbmUuXG4gKiBAcmV0dXJucyB7RE9NTm9kZX0gQSByZWYgdG8gdGhlIHVwZGF0ZWQgRE9NTm9kZVxuICovXG5mdW5jdGlvbiB1cGRhdGVET00oZWwsIHZET00sIG5leHRET00pIHtcbiAgLy8gRW5zdXJlIG91ciBuZXh0IHZET01Ob2RlIGlzIG9mIGEgdmFsaWQgdHlwZVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJlxuICAgICAgIShuZXh0RE9NLnR5cGUgaW4geyBET01Ob2RlOjAsIFRleHROb2RlOjAgfSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdkRPTU5vZGUudHlwZSBmb3IgJHtKU09OLnN0cmluZ2lmeShuZXh0RE9NKX1gKTtcbiAgfVxuXG4gIGlmIChuZXh0RE9NLnR5cGUgPT09ICdUZXh0Tm9kZScpIHtcbiAgICAvLyByZXBsYWNlIHRoZSBjdXJyZW50IG5vZGUgd2l0aCBhIG5ldyB0ZXh0Tm9kZVxuICAgIGVsLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5leHRET00uY29udGVudCksIGVsKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodkRPTS50eXBlICE9PSAnRE9NTm9kZScgfHwgKCB2RE9NLnRhZ05hbWUgIT09IG5leHRET00udGFnTmFtZSApKSB7XG4gICAgICAvLyBpZiB3ZSBoYXZlIGEgZGlmZmVyZW50IGtpbmQgb2Ygbm9kZSwgcmVtb3ZlIHRoZSBvbGQgYW5kIGVtcHR5IHZET00ncyBzcGVjXG4gICAgICBjb25zdCBuZXh0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5leHRET00udGFnTmFtZSk7XG4gICAgICBlbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChuZXh0RWwsIGVsKTtcbiAgICAgIGVsID0gbmV4dEVsO1xuICAgICAgdkRPTSA9IGQobmV4dERPTS50YWdOYW1lKSgpO1xuICAgIH1cblxuICAgIC8vIGJydXRlLWZvcmNlIHJlbW92ZS9hZGQgYWxsIGV2ZW50IGxpc3RlbmVyc1xuICAgIE9iamVjdC5rZXlzKHZET00uZXZlbnRzKS5mb3JFYWNoKGV2dCA9PiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgdkRPTS5ldmVudHNbZXZ0XSkpO1xuICAgIE9iamVjdC5rZXlzKG5leHRET00uZXZlbnRzKS5mb3JFYWNoKGV2dCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKGV2dCwgbmV4dERPTS5ldmVudHNbZXZ0XSkpO1xuICAgIC8vIGFjdHVhbGx5IGRpZmYgdGhlIGF0dHJpYnV0ZXMgYmVjYXVzZSBvdGhlcndpc2UgdGhlcmUgYXJlIHdlaXJkIHNpZGUtZWZmZWN0cyBpbiBGRiA6KFxuICAgIE9iamVjdC5rZXlzKHZET00uYXR0cnMpXG4gICAgICAuZmlsdGVyKGF0dHIgPT4gIShhdHRyIGluIG5leHRET00uYXR0cnMpKVxuICAgICAgLmZvckVhY2goYXR0ciA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cikpOyAgLy8gLnZhbHVlIGlzIGEgc2lsZW50IGZhaWx1cmUgd2UgY2FuIGlnbm9yZVxuICAgIE9iamVjdC5rZXlzKG5leHRET00uYXR0cnMpXG4gICAgICAuZmlsdGVyKGF0dHIgPT4gYXR0ciAhPT0gJ3ZhbHVlJylcbiAgICAgIC5maWx0ZXIoYXR0ciA9PiBuZXh0RE9NLmF0dHJzW2F0dHJdICE9PSB2RE9NLmF0dHJzW2F0dHJdKVxuICAgICAgLmZvckVhY2goYXR0ciA9PiBlbC5zZXRBdHRyaWJ1dGUoYXR0ciwgbmV4dERPTS5hdHRyc1thdHRyXSkpO1xuICAgIGlmIChuZXh0RE9NLmF0dHJzLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmXG4gICAgICAgIG5leHRET00uYXR0cnMudmFsdWUgIT09IGVsLnZhbHVlKSB7XG4gICAgICBlbC52YWx1ZSA9IG5leHRET00uYXR0cnMudmFsdWU7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGNoaWxkcmVuIGluIHBsYWNlXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2RE9NLmNoaWxkcmVuLmxlbmd0aCAmJiBpIDwgbmV4dERPTS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdXBkYXRlRE9NKGVsLmNoaWxkTm9kZXNbaV0sIHZET00uY2hpbGRyZW5baV0sIG5leHRET00uY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgICAvLyBpZiB0aGVyZSBhcmUgbmV3IGNobGlkcmVuIHRvIGFkZCwgYWRkIHRoZW1cbiAgICBmb3IgKHZhciBpID0gdkRPTS5jaGlsZHJlbi5sZW5ndGg7IGkgPCBuZXh0RE9NLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuZXh0YyA9IG5leHRET00uY2hpbGRyZW5baV07XG4gICAgICBpZiAobmV4dGMudHlwZSA9PT0gJ1RleHROb2RlJykge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuZXh0Yy5jb250ZW50KSk7XG4gICAgICB9IGVsc2UgaWYgKG5leHRjLnR5cGUgPT09ICdET01Ob2RlJykge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5leHRjLnRhZ05hbWUpKTtcbiAgICAgICAgdXBkYXRlRE9NKGVsLmxhc3RDaGlsZCwgZChuZXh0Yy50YWdOYW1lKSgpLCBuZXh0Yyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG5vZGUgdHlwZSBmb3Igbm9kZTogJHtKU09OLnN0cmluZ2lmeShuZXh0Yyl9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoZXJlIGFyZSBleHRyYSBjaGlsZHJlbiB0byByZW1vdmUsIHJlbW92ZSB0aGVtXG4gICAgZm9yICh2YXIgaSA9IG5leHRET00uY2hpbGRyZW4ubGVuZ3RoOyBpIDwgdkRPTS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IENvbXBvbmVudCAoKHN0YXRlLCBkaXNwYXRjaCkgPT4gdkRPTU5vZGUpXG4gKiBAcGFyYW0ge2FueX0gaW5pdGlhbFN0YXRlIFRoZSBmaXJzdCBzdGF0ZSB0byByZW5kZXIgQ29tcG9uZW50IHdpdGhcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHVwZGF0ZXIgKChzdGF0ZSwgYWN0aW9uLCBwYXlsb2FkKSA9PiBuZXh0U3RhdGUpXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsIFRoZSBET00gbm9kZSB0byBtb3VudCB0aGUgYXBwIGF0XG4gKiBAcGFyYW0ge2Z1bmNbXX0gbWlkZGxld2FyZXMgbmV4dCA9PiAoc3RhdGUsIGFjdGlvbiwgcGF5bG9hZCkgPT4gc3RhdGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyKENvbXBvbmVudCwgaW5pdGlhbFN0YXRlLCB1cGRhdGVyLCBlbCwgbWlkZGxld2FyZXMgPSBbXSkge1xuICB2YXIgc3RhdGUgPSBpbml0aWFsU3RhdGUsXG4gICAgICBkaXNwYXRjaGluZywgIC8vIGd1YXJkIGFnYWluc3QgdXBkYXRlcnMgdHJ5aW5nIHRvIGRpc3BhdGNoXG4gICAgICBkaXJ0eSA9IGZhbHNlLCAgLy8gZ3VhcmQgYWdhaW5zdCBxdWV1aW5nIG1vcmUgUkFGcyB3aGVuIG9uZSBpcyBhbHJlYWR5IHF1ZXVlZFxuICAgICAgdkRPTSA9IGQoZWwudGFnTmFtZSkoKTsgIC8vIGR1bW15IHNwZWMgZm9yIHRoZSBub2RlIHdlJ3JlIGF0dGFjaGluZyB0b1xuICBjb25zdCBtd1VwZGF0ZXIgPSBtaWRkbGV3YXJlcy5yZWR1Y2VSaWdodCgobmV4dCwgbXcpID0+IG13KG5leHQpLCB1cGRhdGVyKTtcblxuICAvKipcbiAgICogQHBhcmFtIHtTeW1ib2x8c3RyaW5nfSBhY3Rpb24/IFRoZSBhY3Rpb24gdG8gZGlzcGF0Y2ggKG9yIHVuZGVmaW5lZCB0byBmb3JjZSBhIHJlbmRlcilcbiAgICogQHBhcmFtIHthbnl9IHBheWxvYWQ/IEFueSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWN0aW9uXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgY29uc29sZS5pbmZvKGFjdGlvbik7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgZGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7YWN0aW9uLnRvU3RyaW5nKCl9JyB3YXMgZGlzcGF0Y2hlZCB3aGlsZSAnJHtkaXNwYXRjaGluZy50b1N0cmluZygpfScgd2FzIHN0aWxsIHVwZGF0aW5nLiBVcGRhdGVycyBzaG91bGQgYmUgcHVyZSBmdW5jdGlvbnMgYW5kIG11c3Qgbm90IGRpc3BhdGNoIGFjdGlvbnMuYCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBkaXNwYXRjaGluZyA9IGFjdGlvbjtcbiAgICAgIHN0YXRlID0gbXdVcGRhdGVyKHN0YXRlLCBhY3Rpb24sIHBheWxvYWQpO1xuICAgICAgY29uc29sZS5pbmZvKCc+Jywgc3RhdGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkaXNwYXRjaGluZyA9IG51bGw7XG4gICAgfVxuICAgIHVwZGF0ZVVJKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFF1ZXVlIGEgVUkgdXBkYXRlIGlmIG9uZSBpc24ndCBhbHJlYWR5IHF1ZXVlZFxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZVVJKCkge1xuICAgIGlmIChkaXJ0eSkgeyByZXR1cm47IH0gIC8vIFJBRiBhbHJlYWR5IHF1ZXVlZFxuICAgIGRpcnR5ID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZWwgPSB1cGRhdGVET00oZWwsIHZET00sIHZET00gPSBDb21wb25lbnQoc3RhdGUsIGRpc3BhdGNoKSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBkaXJ0eSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIGtpY2sgaXQgb2ZmIVxuICBkaXNwYXRjaCgpO1xuXG4gIC8vIGdpdmUgYmFjayBhIGRpc3BhdGNoIHJlZiwgc28gd2UgY2FuIGhvb2sgdGhpbmdzIHVwIHRvIG1ha2UgYWN0aW9ucyBvdXRzaWRlXG4gIC8vIG9mIGNvbXBvbmVudHNcbiAgcmV0dXJuIGRpc3BhdGNoO1xufVxuIl19
