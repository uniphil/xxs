'use strict';


(function(global) {
  const isHandler = attr => attr.startsWith('on');

  const d = name => (attrs, children) => {
    const el = document.createElement(name);
    Object.keys(attrs)
      .filter(attr => !!attrs[attr])
      .forEach(attr =>
        attr.startsWith('on') ?
          el.addEventListener(attr.slice(2).toLowerCase(), attrs[attr]) :
          el.setAttribute(attr, attrs[attr]));
    children.forEach(child =>
      el.appendChild(child));
    return el;
  };

  const t = s => document.createTextNode(s);
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


  function render(reducer, Component, el) {
    var state, oldTree;

    const boundComponent = Component(
      action => payload => dispatch(action, payload)
    );

    const dispatch = (action, payload) => {
      state = reducer(state, action, payload);
      replaceChildren(el, boundComponent(state));
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
