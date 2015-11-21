'use strict';


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

const ADD_COUNTER = Symbol('ADD_COUNTER');
const REMOVE_COUNTER = Symbol('REMOVE_COUNTER');
const INCREMENT = Symbol('INCREMENT');
const DECREMENT = Symbol('DECREMENT');


const Counter = connect => state =>
  div({}, [
    button({ onClick: connect(DECREMENT) }, [
      t('-')]),
    t(state),
    button({ onClick: connect(INCREMENT) }, [
      t('+')]),
  ]);


const createReducer = (initialState, handlers) => (prevState, action, payload) => {
  if (typeof handlers[action] !== 'undefined') {
    return handlers[action](prevState, payload);
  } else {
    return (typeof prevState !== 'undefined') ? prevState : initialState;
  }
};


function setAt(arr, i, v) {
  const copy = arr.slice();
  copy[i] = v;
  return copy;
}


function pop(arr) {
  const copy = arr.slice();
  copy.pop();
  return copy;
}


const countersReducer = createReducer([], ({
  [ADD_COUNTER]: state => state.concat([0]),
  [REMOVE_COUNTER]: state => pop(state),
  [DECREMENT]: (state, i) => setAt(state, i, state[i] - 1),
  [INCREMENT]: (state, i) => setAt(state, i, state[i] + 1),
}));


function replaceChildren(el, newNode) {
  while (el.lastChild) {
    el.lastChild.remove();
  }
  el.appendChild(newNode);
}


const Counters = connect => state =>
  div({}, [
    div({}, [
      button({
        onClick: connect(REMOVE_COUNTER),
        disabled: state.length < 1,
      }, [t('remove')]),
      button({
        onClick: connect(ADD_COUNTER)
      }, [t('add')]),
    ]),
    div({}, state.map((count, i) =>
      Counter(action => () => connect(action)(i))(state[i]))),
  ]);


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


render(countersReducer, Counters, document.getElementById('app'));
