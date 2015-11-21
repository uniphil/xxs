'use strict';


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


render(countersReducer, Counters, document.getElementById('app'));
