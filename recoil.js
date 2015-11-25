'use strict';


(function(global) {
  const isHandler = attr => attr.startsWith('on');

  const d = name => (props, children) => ({
    type: 'DOMNode',
    tagName: name,
    events: props && props.events || {},
    attrs: props && props.attrs || {},
    children: children || [],
  });
  const t = content => ({ type: 'TextNode', content });
  const div = d('DIV');
  const button = d('BUTTON');
  const label = d('LABEL');
  const input = d('INPUT');
  const form = d('FORM');
  const p = d('P');


  const createReducer = (initialState, handlers) => (prevState, action, payload) => {
    if (typeof handlers[action] !== 'undefined') {
      return handlers[action](prevState, payload);
    } else {
      return (typeof prevState !== 'undefined') ? prevState : initialState;
    }
  };


  function updateDOM(el, vNode, next) {
    if (next.type === 'TextNode') {
      el.parentElement.replaceChild(document.createTextNode(next.content), el);
    } else if (next.type ==='DOMNode') {
      if (vNode.type !== 'DOMNode' || ( vNode.type === 'DOMNode' && vNode.tagName !== next.tagName )) {
        const nextEl = document.createElement(next.tagName);
        el.parentElement.replaceChild(nextEl, el);
        el = nextEl;
        vNode = d(next.tagName)();
      }
      Object.keys(vNode.events).forEach(evt => el.removeEventListener(evt, vNode.events[evt]));
      Object.keys(next.events).forEach(evt => el.addEventListener(evt, next.events[evt]));
      Object.keys(vNode.attrs).forEach(attr => attr === 'value'
        ? el.value = ''
        : el.removeAttribute(attr));
      Object.keys(next.attrs).forEach(attr => attr === 'value'
        ? el.value = next.attrs[attr]
        : el.setAttribute(attr, next.attrs[attr]));
      for (let i = 0, oldc, nextc; (oldc = vNode.children[i]) && (nextc = next.children[i]); i++) {
        updateDOM(el.childNodes[i], oldc, nextc);
      }
      for (let i = vNode.children.length, nextc; nextc = next.children[i]; i++) {
        el.appendChild(document.createElement(nextc.tagName));
        updateDOM(el.lastChild, d(nextc.tagName)(), nextc);
      }
      for (let i = next.children.length; i < vNode.children.length; i++) {
        el.removeChild(el.lastChild);
      }
    } else {
      throw new Error(`Unknown tree type for ${JSON.stringify(tree)}`);
    }
    return el;
  }


  function render(reducer, Component, el) {
    var state, vNode = div();

    const boundComponent = Component(
      action => payload => dispatch(action, payload)
    );

    const dispatch = (action, payload) => {
      state = reducer(state, action, payload);
      console.info(state);
      el = updateDOM(el, vNode, vNode = boundComponent(state));
    };

    dispatch();
  }


  Object.assign(global, {
    t,
    div,
    button,
    label,
    input,
    form,
    p,
    createReducer,
    render,
  });

})(window);
