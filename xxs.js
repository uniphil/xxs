'use strict';

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
const domFactory = name => (props, children) => {
  if (process.env.NODE_ENV !== 'production') {
    // it's easy to forget an empty {} if no props are needed
    if (props && Array.isArray(props)) {
      throw new Error(`Expected an Object for props but found an Array: '${JSON.stringify(props)}'\nDid you forget to put an empty '{}' for props before the child array?`);
    }
    // props only has two valid keys, so catch any typos here
    if (props && Object.keys(props).some(k => ['events', 'attrs'].indexOf(k) === -1)) {
      throw new Error(`Invalid key found in props {${Object.keys(props).join(': ..., ')}: ...} for DOMNode '${name}'\nOnly 'attrs' and 'events' are allowed -- did you forget to nest your attribute or event inside one of those?`);
    }
    // single children (even text nodes) still need to be wrapped in an array, but I mess this up constantly
    if (children && !Array.isArray(children)) {
      throw new Error(`Expected an Array for children but found ${JSON.stringify(children)}. Did you forget to wrap a single child in an array?`);
    }
  }
  return {
    type: 'DOMNode',
    tagName: name.toUpperCase(),
    events: props && props.events || {},
    attrs: props && props.attrs || {},
    children: children || [],
  };
};

// Make factories for all valid tagNames. This list is blatantly stolen from React.
const d = {};  ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr']
  .forEach(n => d[n] = domFactory(n));

/**
 * Text node factory
 * @param {string} content The content of the TextNode
 * @returns {object} A Virtual DOM text node
 */
const t = content => ({ type: 'TextNode', content });

/**
 * A helper to generate updater functions mapped by action
 * @param {object} actionUpdates An object with Actions (strings or symbols) as
 *   keys and ((state, payload) => nextState) functions as values
 * @returns {function} An updater function ((state, action, payload) => nextState)
 */
function createUpdater(actionUpdates) {
  if (process.env.NODE_ENV !== 'production') {
    // Ensure that all values are functions
    Object.getOwnPropertySymbols(actionUpdates).concat(Object.keys(actionUpdates))
      .filter(k => typeof actionUpdates[k] !== 'function')
      .forEach(k => { throw new Error(`Expected a ((state, payload) => state) function for action '${k.toString()}' but found '${actionUpdates[k].toString()}'`); });
  }
  // If we have this action as a key, call it's value to update state, otherwise
  // pass through the state.
  return (state, action, payload) =>
    actionUpdates[action] ? actionUpdates[action](state, payload) : state;
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
  if (process.env.NODE_ENV !== 'production' &&
      !(nextDOM.type in { DOMNode:0, TextNode:0 })) {
    throw new Error(`Unknown vDOMNode.type for ${JSON.stringify(nextDOM)}`);
  }

  if (nextDOM.type === 'TextNode') {
    // replace the current node with a new textNode
    el.parentElement.replaceChild(document.createTextNode(nextDOM.content), el);
  } else {
    if (vDOM.type !== 'DOMNode' || ( vDOM.tagName !== nextDOM.tagName )) {
      // if we have a different kind of node, remove the old and empty vDOM's spec
      const nextEl = document.createElement(nextDOM.tagName);
      el.parentElement.replaceChild(nextEl, el);
      el = nextEl;
      vDOM = domFactory(nextDOM.tagName)();
    }

    // brute-force remove/add all event listeners
    Object.keys(vDOM.events).forEach(evt => el.removeEventListener(evt, vDOM.events[evt]));
    Object.keys(nextDOM.events).forEach(evt => el.addEventListener(evt, nextDOM.events[evt]));
    // actually diff the attributes because otherwise there are weird side-effects in FF :(
    Object.keys(vDOM.attrs)
      .filter(attr => !(attr in nextDOM.attrs))
      .forEach(attr => el.removeAttribute(attr));  // .value is a silent failure we can ignore
    Object.keys(nextDOM.attrs)
      .filter(attr => attr !== 'value')
      .filter(attr => nextDOM.attrs[attr] !== vDOM.attrs[attr])
      .forEach(attr => el.setAttribute(attr, nextDOM.attrs[attr]));
    if (nextDOM.attrs.hasOwnProperty('value') &&
        nextDOM.attrs.value !== el.value) {
      el.value = nextDOM.attrs.value;
    }

    // Update children in place
    for (var i = 0; i < vDOM.children.length && i < nextDOM.children.length; i++) {
      updateDOM(el.childNodes[i], vDOM.children[i], nextDOM.children[i]);
    }
    // if there are new chlidren to add, add them
    for (var i = vDOM.children.length; i < nextDOM.children.length; i++) {
      const nextc = nextDOM.children[i];
      if (nextc.type === 'TextNode') {
        el.appendChild(document.createTextNode(nextc.content));
      } else if (nextc.type === 'DOMNode') {
        el.appendChild(document.createElement(nextc.tagName));
        updateDOM(el.lastChild, domFactory(nextc.tagName)(), nextc);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Unknown node type for node: ${JSON.stringify(nextc)}`);
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
function render(Component, initialState, updater, el, debug) {
  var state = initialState,
      dispatching,  // guard against updaters trying to dispatch
      dirty = false,  // guard against queuing more RAFs when one is already queued
      vDOM = domFactory(el.tagName)();  // dummy spec for the node we're attaching to

  /**
   * @param {Symbol|string} action? The action to dispatch (or undefined to force a render)
   * @param {any} payload? Any data associated with the action
   * @returns {void}
   */
  function dispatch(action, payload) {
    if (process.env.NODE_ENV !== 'production' && dispatching) {
      throw new Error(`'${action.toString()}' was dispatched while '${dispatching.toString()}' was still updating. Updaters should be pure functions and must not dispatch actions.`);
    }
    try {
      dispatching = action;
      state = updater(state, action, payload);
      if (process.env.NODE_ENV !== 'production' && debug) {
        console.info(state);
      }
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

  // kick it off!
  dispatch();
}
