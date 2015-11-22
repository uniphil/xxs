'use strict';


const ADD_COUNTER = Symbol('ADD_COUNTER');
const REMOVE_COUNTER = Symbol('REMOVE_COUNTER');
const WRAP_COUNTER = Symbol('WRAP_COUNTER');
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


const counterReducer = createReducer(0, {
  [INCREMENT]: state => state + 1,
  [DECREMENT]: state => state - 1,
});


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
      Counter(action => payload => connect(WRAP_COUNTER)({
        action,
        payload,
        i,
      }))(state[i]))),
  ]);


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

const countersReducer = createReducer([], {
  [ADD_COUNTER]: state => state.concat([counterReducer()]),
  [REMOVE_COUNTER]: state => pop(state),
  [WRAP_COUNTER]: (state, payload) =>
    setAt(state, payload.i,
      counterReducer(state[payload.i], payload.action, payload.payload)),
});


render(countersReducer, Counters, document.getElementById('app'));
