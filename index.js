'use strict';


/// Counter: actions, view, reducer

const counterActions = {
  INCREMENT: Symbol('INCREMENT'),
  DECREMENT: Symbol('DECREMENT'),
};

const Counter = connect => state =>
  div({}, [
    button({ onClick: connect(counterActions.DECREMENT) }, [
      t('-')]),
    t(state),
    button({ onClick: connect(counterActions.INCREMENT) }, [
      t('+')]),
  ]);

const counterReducer = createReducer(0, {
  [counterActions.INCREMENT]: state => state + 1,
  [counterActions.DECREMENT]: state => state - 1,
});


/// List: actions, view, reducer

const listActions = {
  ADD: Symbol('ADD'),
  REMOVE: Symbol('REMOVE'),
  CHILD_ACTION: Symbol('CHILD_ACTION'),
};

const List = connect => state =>
  div({}, [
    div({}, [
      button({
        onClick: connect(listActions.REMOVE),
        disabled: state.length < 1,
      }, [t('remove')]),
      button({
        onClick: connect(listActions.ADD)
      }, [t('add')]),
    ]),
    div({}, state.map((count, i) =>
      Counter(action => {
        if (Object.keys(counterActions).some(k => counterActions[k] === action)) {
          return payload => connect(listActions.CHILD_ACTION)({
            action,
            payload,
            i
          });
        } else {
          return connect(action);
        }
      })(state[i]))),
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

const listReducer = createReducer([], {
  [listActions.ADD]: state => state.concat([counterReducer()]),
  [listActions.REMOVE]: state => pop(state),
  [listActions.CHILD_ACTION]: (state, payload) =>
    setAt(state, payload.i,
      counterReducer(state[payload.i], payload.action, payload.payload)),
});


render(listReducer, List, document.getElementById('app'));
