// const combineReducers = reducers => (prevState, action, payload) =>
//   Object.assign.apply(null, Object.keys(reducers).map(key =>
//     ({ [key]: reducers[key](prevState, action, payload) })));





// const connect = mapStuff =>


// const ConnectedCounter = connect({
//   actions: {
//     decrement: counterActions.DECREMENT,
//     increment: counterActions.INCREMENT,
//   },
//   state: state => ({
//     value: state
//   }),
// })(Counter);


'use strict';


// const isHandler =


const d = name => (attrs, handlers, children) => {
  const el = document.createElement(name);
  Object.keys(attrs).forEach(attr =>
    el.setAttribute(attr, attrs[attr]));
  Object.keys(handlers).forEach(handler =>
    el.addEventListener(handler, handlers[handler]));
  children.forEach(child =>
    el.appendChild(child));
  return el;
};

const t = s => document.createTextNode(s);
const div = d('div');
const button = d('button');


const INCREMENT = Symbol('INCREMENT');
const DECREMENT = Symbol('DECREMENT');


const Counter = connect => state =>
  div({}, {}, [
    button({}, { click: connect(DECREMENT) }, [
      t('-')]),
    t(state),
    button({}, {click: connect(INCREMENT) }, [
      t('+')]),
  ]);


const createReducer = (initialState, handlers) => (prevState, action, payload) => {
  if (typeof handlers[action] !== 'undefined') {
    return handlers[action](prevState, payload);
  } else {
    return (typeof prevState !== 'undefined') ? prevState : initialState;
  }
};


const counterReducer = createReducer(0, ({
  [DECREMENT]: state => state - 1,
  [INCREMENT]: state => state + 1,
}));


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


render(counterReducer, Counter, document.getElementById('app'));
