(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _xxs = require('../../xxs');

var _helpers = require('./helpers');

var _map = ['div', 'p'].map(_xxs.d);

var _map2 = _slicedToArray(_map, 2);

var div = _map2[0];
var p = _map2[1];

var App = function App(state, dispatch) {
  return div({ attrs: { 'class': 'app' } }, [p({}, [(0, _xxs.t)('hello ' + state.name)])]);
};

var stack = {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanMiLCJoZWxwZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi4uLy4uL3h4cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O1dDRW1CLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFGMUIsQ0FBQyxDQUU0Qjs7OztJQUE5QixHQUFHO0lBQUUsQ0FBQzs7QUFHZCxJQUFNLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxLQUFLLEVBQUUsUUFBUTtTQUMxQixHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUNqQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsU0FQQyxDQUFDLGFBT1MsS0FBSyxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUMsQ0FDbEMsQ0FBQztDQUFBLENBQUM7O0FBR0wsSUFBTSxLQUFLLEdBQUcsRUFFYixDQUFDOztBQUdGLElBQU0sUUFBUSxHQUFHLFNBaEJhLE1BQU0sRUFnQlosR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQ2hCckUsSUFBTSxDQUFDLFdBQUQsQ0FBQyxHQUFHO0FBQ2YsUUFBTSxrQkFBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQ25CLFdBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ3hDO0FBQ0QsS0FBRyxlQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ2pCLFdBQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLHNC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TyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQixRQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksSUFBSSxXQUFXLEVBQUU7QUFDeEQsWUFBTSxJQUFJLEtBQUssUUFBSyxNQUFNLENBQUMsUUFBUSxFQUFFLGtDQUEyQixXQUFXLENBQUMsUUFBUSxFQUFFLDZGQUF5RixDQUFDO0tBQ2pMO0FBQ0QsUUFBSTtBQUNGLGlCQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFdBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxhQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMxQixTQUFTO0FBQ1IsaUJBQVcsR0FBRyxJQUFJLENBQUM7S0FDcEI7QUFDRCxZQUFRLEVBQUUsQ0FBQztHQUNaOzs7Ozs7QUFBQyxBQU1GLFdBQVMsUUFBUSxHQUFHO0FBQ2xCLFFBQUksS0FBSyxFQUFFO0FBQUUsYUFBTztLQUFFO0FBQUEsQUFDdEIsU0FBSyxHQUFHLElBQUksQ0FBQztBQUNiLHlCQUFxQixDQUFDLFlBQU07QUFDMUIsVUFBSTtBQUNGLFVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO09BQzdELFNBQVM7QUFDUixhQUFLLEdBQUcsS0FBSyxDQUFDO09BQ2Y7S0FDRixDQUFDLENBQUM7R0FDSjs7O0FBQUMsQUFHRixVQUFRLEVBQUU7Ozs7QUFBQyxBQUlYLFNBQU8sUUFBUSxDQUFDO0NBQ2pCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IGQsIHQsIGNyZWF0ZVVwZGF0ZXIsIHJlbmRlciB9IGZyb20gJy4uLy4uL3h4cyc7XG5pbXBvcnQgeyBvIH0gZnJvbSAnLi9oZWxwZXJzJztcbmNvbnN0IFsgZGl2LCBwIF0gPSBbJ2RpdicsICdwJ10ubWFwKGQpO1xuXG5cbmNvbnN0IEFwcCA9IChzdGF0ZSwgZGlzcGF0Y2gpID0+XG4gIGRpdih7IGF0dHJzOiB7ICdjbGFzcyc6ICdhcHAnIH0gfSwgW1xuICAgIHAoe30sIFt0KGBoZWxsbyAke3N0YXRlLm5hbWV9YCldKSxcbiAgXSk7XG5cblxuY29uc3Qgc3RhY2sgPSB7XG5cbn07XG5cblxuY29uc3QgZGlzcGF0Y2ggPSByZW5kZXIoQXBwLCBpbml0LCB1cGRhdGVyLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuIiwiZXhwb3J0IGNvbnN0IG8gPSB7XG4gIHVwZGF0ZShvYmosIHRvTWVyZ2UpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgb2JqLCB0b01lcmdlKTtcbiAgfSxcbiAgc2V0KG9iaiwga2V5LCB2YWwpIHtcbiAgICByZXR1cm4gby51cGRhdGUob2JqLCB7IFtrZXldOiB2YWwgfSk7XG4gIH0sXG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogZCBhcmdzOlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGhlIHRhZ05hbWUgb2YgdGhlIERPTSBub2RlIHRvIG1ha2UgYSBmYWN0b3J5IGZvclxuICogUmV0dXJuZWQgZnVuY3Rpb24gYXJnczpcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBBbiBvYmplY3Qgd2l0aCBhbGwgZXZlbnRzIGFuZCBhdHRyaWJ1dGVzIHRvIHNldCBvblxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzLmF0dHJzIEF0dHJpYnV0ZXMgdG8gc2V0IHdpdGggRWxlbWVudC5zZXRBdHRyaWJ1dGUoKSxcbiAqICAgdGhvdWdoIG5vdGUgdGhhdCBgdmFsdWVgIGlzIHNwZWNpYWwgaXMgZGlyZWN0bHkgYXNzaWduZWQgdG8gdGhlIGVsZW1lbnRcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcy5ldmVudHMgRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgdG8gYXR0YWNoXG4gKiBAcGFyYW0ge29iamVjdFtdfSBjaGlsZHJlbiBjaGlsZHJlbiB0byBhcHBlbmRDaGlsZCBvbiB0aGlzIGVsZW1lbnQsIGFzXG4gKiAgIFZpcnR1YWwgRE9NIG5vZGVzIGxpa2UgdGhvc2UgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvblxuICogQHJldHVybnMge29iamVjdH0gQSBWaXJ0dWFsIERPTSBub2RlIHNwZWNpZnlpbmcgdGhpcyBub2RlXG4gKi9cbmV4cG9ydCBjb25zdCBkID0gbmFtZSA9PiAocHJvcHMsIGNoaWxkcmVuKSA9PiB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgLy8gaXQncyBlYXN5IHRvIGZvcmdldCBhbiBlbXB0eSB7fSBpZiBubyBwcm9wcyBhcmUgbmVlZGVkXG4gICAgaWYgKHByb3BzICYmIEFycmF5LmlzQXJyYXkocHJvcHMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGFuIE9iamVjdCBmb3IgcHJvcHMgYnV0IGZvdW5kIGFuIEFycmF5OiAnJHtKU09OLnN0cmluZ2lmeShwcm9wcyl9J1xcbkRpZCB5b3UgZm9yZ2V0IHRvIHB1dCBhbiBlbXB0eSAne30nIGZvciBwcm9wcyBiZWZvcmUgdGhlIGNoaWxkIGFycmF5P2ApO1xuICAgIH1cbiAgICAvLyBwcm9wcyBvbmx5IGhhcyB0d28gdmFsaWQga2V5cywgc28gY2F0Y2ggYW55IHR5cG9zIGhlcmVcbiAgICBpZiAocHJvcHMgJiYgT2JqZWN0LmtleXMocHJvcHMpLnNvbWUoayA9PiBbJ2V2ZW50cycsICdhdHRycyddLmluZGV4T2YoaykgPT09IC0xKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGtleSBmb3VuZCBpbiBwcm9wcyB7JHtPYmplY3Qua2V5cyhwcm9wcykuam9pbignOiAuLi4sICcpfTogLi4ufSBmb3IgRE9NTm9kZSAnJHtuYW1lfSdcXG5Pbmx5ICdhdHRycycgYW5kICdldmVudHMnIGFyZSBhbGxvd2VkIC0tIGRpZCB5b3UgZm9yZ2V0IHRvIG5lc3QgeW91ciBhdHRyaWJ1dGUgb3IgZXZlbnQgaW5zaWRlIG9uZSBvZiB0aG9zZT9gKTtcbiAgICB9XG4gICAgLy8gc2luZ2xlIGNoaWxkcmVuIChldmVuIHRleHQgbm9kZXMpIHN0aWxsIG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBhcnJheSwgYnV0IEkgbWVzcyB0aGlzIHVwIGNvbnN0YW50bHlcbiAgICBpZiAoY2hpbGRyZW4gJiYgIUFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGFuIEFycmF5IGZvciBjaGlsZHJlbiBidXQgZm91bmQgJHtKU09OLnN0cmluZ2lmeShjaGlsZHJlbil9LiBEaWQgeW91IGZvcmdldCB0byB3cmFwIGEgc2luZ2xlIGNoaWxkIGluIGFuIGFycmF5P2ApO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIHR5cGU6ICdET01Ob2RlJyxcbiAgICB0YWdOYW1lOiBuYW1lLnRvVXBwZXJDYXNlKCksXG4gICAgZXZlbnRzOiBwcm9wcyAmJiBwcm9wcy5ldmVudHMgfHwge30sXG4gICAgYXR0cnM6IHByb3BzICYmIHByb3BzLmF0dHJzIHx8IHt9LFxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbiB8fCBbXSxcbiAgfTtcbn07XG5cbi8qKlxuICogVGV4dCBub2RlIGZhY3RvcnlcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBUZXh0Tm9kZVxuICogQHJldHVybnMge29iamVjdH0gQSBWaXJ0dWFsIERPTSB0ZXh0IG5vZGVcbiAqL1xuZXhwb3J0IGNvbnN0IHQgPSBjb250ZW50ID0+ICh7IHR5cGU6ICdUZXh0Tm9kZScsIGNvbnRlbnQgfSk7XG5cbi8qKlxuICogQSBoZWxwZXIgdG8gZ2VuZXJhdGUgdXBkYXRlciBmdW5jdGlvbnMgbWFwcGVkIGJ5IGFjdGlvblxuICogQHBhcmFtIHtvYmplY3R9IGFjdGlvblVwZGF0ZXMgQW4gb2JqZWN0IHdpdGggQWN0aW9ucyAoc3RyaW5ncyBvciBzeW1ib2xzKSBhc1xuICogICBrZXlzIGFuZCAoKHN0YXRlLCBwYXlsb2FkKSA9PiBuZXh0U3RhdGUpIGZ1bmN0aW9ucyBhcyB2YWx1ZXNcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gQW4gdXBkYXRlciBmdW5jdGlvbiAoKHN0YXRlLCBhY3Rpb24sIHBheWxvYWQpID0+IG5leHRTdGF0ZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVwZGF0ZXIoYWN0aW9uVXBkYXRlcykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIEVuc3VyZSB0aGF0IGFsbCB2YWx1ZXMgYXJlIGZ1bmN0aW9uc1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoYWN0aW9uVXBkYXRlcykuY29uY2F0KE9iamVjdC5rZXlzKGFjdGlvblVwZGF0ZXMpKVxuICAgICAgLmZpbHRlcihrID0+IHR5cGVvZiBhY3Rpb25VcGRhdGVzW2tdICE9PSAnZnVuY3Rpb24nKVxuICAgICAgLmZvckVhY2goayA9PiB7IHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYSAoKHN0YXRlLCBwYXlsb2FkKSA9PiBzdGF0ZSkgZnVuY3Rpb24gZm9yIGFjdGlvbiAnJHtrLnRvU3RyaW5nKCl9JyBidXQgZm91bmQgJyR7YWN0aW9uVXBkYXRlc1trXS50b1N0cmluZygpfSdgKTsgfSk7XG4gIH1cbiAgLy8gSWYgd2UgaGF2ZSB0aGlzIGFjdGlvbiBhcyBhIGtleSwgY2FsbCBpdCdzIHZhbHVlIHRvIHVwZGF0ZSBzdGF0ZSwgb3RoZXJ3aXNlXG4gIC8vIHBhc3MgdGhyb3VnaCB0aGUgc3RhdGUuXG4gIHJldHVybiAoc3RhdGUsIGFjdGlvbiwgcGF5bG9hZCkgPT5cbiAgICBhY3Rpb25VcGRhdGVzW2FjdGlvbl0gPyBhY3Rpb25VcGRhdGVzW2FjdGlvbl0oc3RhdGUsIHBheWxvYWQpIDogc3RhdGU7XG59XG5cbi8qKlxuICogVGhlIHNpbXBsZXN0IChhbmQgd29yc3QpIERPTSB1cGRhdGVyIEkgY2FuIGNvbWUgdXAgd2l0aCA6KVxuICogVGFrZXMgdGhlIGJydXRlLWZvcmNlIGFwcHJvYWNoIG9mIHdhbGtpbmcgdGhlIHdob2xlIERPTSB0cmVlLCByZW12aW5nIGFsbFxuICogYXR0cmlidXRlcyBhbmQgZXZlbnRzIHRoYXQgd2VyZSBkZWNsYXJlZCBhdCB0aGUgbGFzdCByZW5kZXIsIGFuZCBhZGRpbmcgYWxsXG4gKiB0aGF0IHdlcmUgZGVjbGFyZWQgZm9yIHRoaXMgcmVuZGVyLiBZZXMsIG1vc3Qgb2YgdGhlIHRpbWUgdGhpcyB3aWxsIHJlbW92ZVxuICogYW5kIHJlLWFkZCBleGFjdGx5IHRoZSBzYW1lIHRoaW5ncy4gRG8gYW55IGJyb3dzZXJzIHNlZSB0aHMgYW5kIG9wdGltaXplIGl0P1xuICogQHBhcmFtIHtET01Ob2RlfSBlbCBBbiBhY3R1YWwgcmVhbCBET00gbm9kZSB0byB1cGRhdGVcbiAqIEBwYXJhbSB7dkRPTU5vZGV9IHZET00gdGhlIGN1cnJlbnQgKHByZXZpb3VzLCBzdGFsZSkgVmlydHVhbCBET00gc3BlY1xuICogQHBhcmFtIHt2RE9NTm9kZX0gbmV4dERPTSB0aGUgbmV4dCBWaXJ0dWFsRE9NIHNwZWMgd2Ugd2FudCBlbCB0byBtYXRjaCB3aGVuXG4gKiAgIHRoaXMgZnVuY3Rpb24gaXMgZG9uZS5cbiAqIEByZXR1cm5zIHtET01Ob2RlfSBBIHJlZiB0byB0aGUgdXBkYXRlZCBET01Ob2RlXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZURPTShlbCwgdkRPTSwgbmV4dERPTSkge1xuICAvLyBFbnN1cmUgb3VyIG5leHQgdkRPTU5vZGUgaXMgb2YgYSB2YWxpZCB0eXBlXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmXG4gICAgICAhKG5leHRET00udHlwZSBpbiB7IERPTU5vZGU6MCwgVGV4dE5vZGU6MCB9KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biB2RE9NTm9kZS50eXBlIGZvciAke0pTT04uc3RyaW5naWZ5KG5leHRET00pfWApO1xuICB9XG5cbiAgaWYgKG5leHRET00udHlwZSA9PT0gJ1RleHROb2RlJykge1xuICAgIC8vIHJlcGxhY2UgdGhlIGN1cnJlbnQgbm9kZSB3aXRoIGEgbmV3IHRleHROb2RlXG4gICAgZWwucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV4dERPTS5jb250ZW50KSwgZWwpO1xuICB9IGVsc2Uge1xuICAgIGlmICh2RE9NLnR5cGUgIT09ICdET01Ob2RlJyB8fCAoIHZET00udGFnTmFtZSAhPT0gbmV4dERPTS50YWdOYW1lICkpIHtcbiAgICAgIC8vIGlmIHdlIGhhdmUgYSBkaWZmZXJlbnQga2luZCBvZiBub2RlLCByZW1vdmUgdGhlIG9sZCBhbmQgZW1wdHkgdkRPTSdzIHNwZWNcbiAgICAgIGNvbnN0IG5leHRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmV4dERPTS50YWdOYW1lKTtcbiAgICAgIGVsLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKG5leHRFbCwgZWwpO1xuICAgICAgZWwgPSBuZXh0RWw7XG4gICAgICB2RE9NID0gZChuZXh0RE9NLnRhZ05hbWUpKCk7XG4gICAgfVxuXG4gICAgLy8gYnJ1dGUtZm9yY2UgcmVtb3ZlL2FkZCBhbGwgZXZlbnQgbGlzdGVuZXJzXG4gICAgT2JqZWN0LmtleXModkRPTS5ldmVudHMpLmZvckVhY2goZXZ0ID0+IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCB2RE9NLmV2ZW50c1tldnRdKSk7XG4gICAgT2JqZWN0LmtleXMobmV4dERPTS5ldmVudHMpLmZvckVhY2goZXZ0ID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBuZXh0RE9NLmV2ZW50c1tldnRdKSk7XG4gICAgLy8gYWN0dWFsbHkgZGlmZiB0aGUgYXR0cmlidXRlcyBiZWNhdXNlIG90aGVyd2lzZSB0aGVyZSBhcmUgd2VpcmQgc2lkZS1lZmZlY3RzIGluIEZGIDooXG4gICAgT2JqZWN0LmtleXModkRPTS5hdHRycylcbiAgICAgIC5maWx0ZXIoYXR0ciA9PiAhKGF0dHIgaW4gbmV4dERPTS5hdHRycykpXG4gICAgICAuZm9yRWFjaChhdHRyID0+IGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKSk7ICAvLyAudmFsdWUgaXMgYSBzaWxlbnQgZmFpbHVyZSB3ZSBjYW4gaWdub3JlXG4gICAgT2JqZWN0LmtleXMobmV4dERPTS5hdHRycylcbiAgICAgIC5maWx0ZXIoYXR0ciA9PiBhdHRyICE9PSAndmFsdWUnKVxuICAgICAgLmZpbHRlcihhdHRyID0+IG5leHRET00uYXR0cnNbYXR0cl0gIT09IHZET00uYXR0cnNbYXR0cl0pXG4gICAgICAuZm9yRWFjaChhdHRyID0+IGVsLnNldEF0dHJpYnV0ZShhdHRyLCBuZXh0RE9NLmF0dHJzW2F0dHJdKSk7XG4gICAgaWYgKG5leHRET00uYXR0cnMuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiZcbiAgICAgICAgbmV4dERPTS5hdHRycy52YWx1ZSAhPT0gZWwudmFsdWUpIHtcbiAgICAgIGVsLnZhbHVlID0gbmV4dERPTS5hdHRycy52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgY2hpbGRyZW4gaW4gcGxhY2VcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZET00uY2hpbGRyZW4ubGVuZ3RoICYmIGkgPCBuZXh0RE9NLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB1cGRhdGVET00oZWwuY2hpbGROb2Rlc1tpXSwgdkRPTS5jaGlsZHJlbltpXSwgbmV4dERPTS5jaGlsZHJlbltpXSk7XG4gICAgfVxuICAgIC8vIGlmIHRoZXJlIGFyZSBuZXcgY2hsaWRyZW4gdG8gYWRkLCBhZGQgdGhlbVxuICAgIGZvciAodmFyIGkgPSB2RE9NLmNoaWxkcmVuLmxlbmd0aDsgaSA8IG5leHRET00uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5leHRjID0gbmV4dERPTS5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChuZXh0Yy50eXBlID09PSAnVGV4dE5vZGUnKSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5leHRjLmNvbnRlbnQpKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dGMudHlwZSA9PT0gJ0RPTU5vZGUnKSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmV4dGMudGFnTmFtZSkpO1xuICAgICAgICB1cGRhdGVET00oZWwubGFzdENoaWxkLCBkKG5leHRjLnRhZ05hbWUpKCksIG5leHRjKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbm9kZSB0eXBlIGZvciBub2RlOiAke0pTT04uc3RyaW5naWZ5KG5leHRjKX1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgdGhlcmUgYXJlIGV4dHJhIGNoaWxkcmVuIHRvIHJlbW92ZSwgcmVtb3ZlIHRoZW1cbiAgICBmb3IgKHZhciBpID0gbmV4dERPTS5jaGlsZHJlbi5sZW5ndGg7IGkgPCB2RE9NLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZWw7XG59XG5cbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gQ29tcG9uZW50ICgoc3RhdGUsIGRpc3BhdGNoKSA9PiB2RE9NTm9kZSlcbiAqIEBwYXJhbSB7YW55fSBpbml0aWFsU3RhdGUgVGhlIGZpcnN0IHN0YXRlIHRvIHJlbmRlciBDb21wb25lbnQgd2l0aFxuICogQHBhcmFtIHtmdW5jdGlvbn0gdXBkYXRlciAoKHN0YXRlLCBhY3Rpb24sIHBheWxvYWQpID0+IG5leHRTdGF0ZSlcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWwgVGhlIERPTSBub2RlIHRvIG1vdW50IHRoZSBhcHAgYXRcbiAqIEBwYXJhbSB7ZnVuY1tdfSBtaWRkbGV3YXJlcyBuZXh0ID0+IChzdGF0ZSwgYWN0aW9uLCBwYXlsb2FkKSA9PiBzdGF0ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoQ29tcG9uZW50LCBpbml0aWFsU3RhdGUsIHVwZGF0ZXIsIGVsLCBtaWRkbGV3YXJlcyA9IFtdKSB7XG4gIHZhciBzdGF0ZSA9IGluaXRpYWxTdGF0ZSxcbiAgICAgIGRpc3BhdGNoaW5nLCAgLy8gZ3VhcmQgYWdhaW5zdCB1cGRhdGVycyB0cnlpbmcgdG8gZGlzcGF0Y2hcbiAgICAgIGRpcnR5ID0gZmFsc2UsICAvLyBndWFyZCBhZ2FpbnN0IHF1ZXVpbmcgbW9yZSBSQUZzIHdoZW4gb25lIGlzIGFscmVhZHkgcXVldWVkXG4gICAgICB2RE9NID0gZChlbC50YWdOYW1lKSgpOyAgLy8gZHVtbXkgc3BlYyBmb3IgdGhlIG5vZGUgd2UncmUgYXR0YWNoaW5nIHRvXG4gIGNvbnN0IG13VXBkYXRlciA9IG1pZGRsZXdhcmVzLnJlZHVjZVJpZ2h0KChuZXh0LCBtdykgPT4gbXcobmV4dCksIHVwZGF0ZXIpO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N5bWJvbHxzdHJpbmd9IGFjdGlvbj8gVGhlIGFjdGlvbiB0byBkaXNwYXRjaCAob3IgdW5kZWZpbmVkIHRvIGZvcmNlIGEgcmVuZGVyKVxuICAgKiBAcGFyYW0ge2FueX0gcGF5bG9hZD8gQW55IGRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBhY3Rpb25cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICBjb25zb2xlLmluZm8oYWN0aW9uKTtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBkaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHthY3Rpb24udG9TdHJpbmcoKX0nIHdhcyBkaXNwYXRjaGVkIHdoaWxlICcke2Rpc3BhdGNoaW5nLnRvU3RyaW5nKCl9JyB3YXMgc3RpbGwgdXBkYXRpbmcuIFVwZGF0ZXJzIHNob3VsZCBiZSBwdXJlIGZ1bmN0aW9ucyBhbmQgbXVzdCBub3QgZGlzcGF0Y2ggYWN0aW9ucy5gKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGRpc3BhdGNoaW5nID0gYWN0aW9uO1xuICAgICAgc3RhdGUgPSBtd1VwZGF0ZXIoc3RhdGUsIGFjdGlvbiwgcGF5bG9hZCk7XG4gICAgICBjb25zb2xlLmluZm8oJz4nLCBzdGF0ZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGRpc3BhdGNoaW5nID0gbnVsbDtcbiAgICB9XG4gICAgdXBkYXRlVUkoKTtcbiAgfTtcblxuICAvKipcbiAgICogUXVldWUgYSBVSSB1cGRhdGUgaWYgb25lIGlzbid0IGFscmVhZHkgcXVldWVkXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlVUkoKSB7XG4gICAgaWYgKGRpcnR5KSB7IHJldHVybjsgfSAgLy8gUkFGIGFscmVhZHkgcXVldWVkXG4gICAgZGlydHkgPSB0cnVlO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBlbCA9IHVwZGF0ZURPTShlbCwgdkRPTSwgdkRPTSA9IENvbXBvbmVudChzdGF0ZSwgZGlzcGF0Y2gpKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGRpcnR5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8ga2ljayBpdCBvZmYhXG4gIGRpc3BhdGNoKCk7XG5cbiAgLy8gZ2l2ZSBiYWNrIGEgZGlzcGF0Y2ggcmVmLCBzbyB3ZSBjYW4gaG9vayB0aGluZ3MgdXAgdG8gbWFrZSBhY3Rpb25zIG91dHNpZGVcbiAgLy8gb2YgY29tcG9uZW50c1xuICByZXR1cm4gZGlzcGF0Y2g7XG59XG4iXX0=
