'use strict';


(function(global) {
  const isHandler = attr => attr.startsWith('on');

  const d = name => (props, children) => ({
    type: 'DOMNode',
    name: name,
    events: props && props.events || {},
    attrs: props && props.attrs || {},
    children: children || []
  });
  const t = content => ({ type: 'TextNode', content });
  const div = d('div');
  const button = d('button');
  const label = d('label');
  const input = d('input');
  const form = d('form');
  const p = d('p');


  const createReducer = (initialState, handlers) => (prevState, action, payload) => {
    if (typeof handlers[action] !== 'undefined') {
      return handlers[action](prevState, payload);
    } else {
      return (typeof prevState !== 'undefined') ? prevState : initialState;
    }
  };


  function replaceChildren(el, newNode) {
    while (el.lastChild) {
      el.lastChild.remove();
    }
    el.appendChild(newNode);
  }

  function toDOM(tree) {
    if (tree.type === 'DOMNode') {
      const el = document.createElement(tree.name);
      Object.keys(tree.events).forEach(evt => el.addEventListener(evt, tree.events[evt]));
      Object.keys(tree.attrs).forEach(attr => el.setAttribute(attr, tree.attrs[attr]));
      tree.children.forEach(childTree => el.appendChild(toDOM(childTree)));
      return el;
    } else if (tree.type === 'TextNode') {
      return document.createTextNode(tree.content);
    } else {
      throw new Error(`Unknown tree type for ${JSON.stringify(tree)}`);
    }
  }


  function render(reducer, Component, el) {
    var state, oldTree;

    const boundComponent = Component(
      action => payload => dispatch(action, payload)
    );

    const dispatch = (action, payload) => {
      state = reducer(state, action, payload);
      console.info(state);
      replaceChildren(el, toDOM(boundComponent(state)));
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
