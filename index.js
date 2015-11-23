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

const counterListActions = {
  ADD: Symbol('ADD'),
  REMOVE: Symbol('REMOVE'),
};


const Counters = ListOf(Counter, counterActions);

const CounterList = connect => state =>
  div({}, [
    div({}, [
      button({
        onClick: connect(counterListActions.REMOVE),
        disabled: state.length < 1,
      }, [t('remove')]),
      t(state.length),
      button({
        onClick: connect(counterListActions.ADD)
      }, [t('add')]),
    ]),
    div({}, Counters.render(connect)(state)),
  ]);


function pop(arr) {
  const copy = arr.slice();
  copy.pop();
  return copy;
}

const counterListReducer = createReducer([], {
  [counterListActions.ADD]: state =>
    state.concat([counterReducer()]),
  [counterListActions.REMOVE]: state =>
    pop(state),
  [Counters.ACTION]: Counters.forward(counterReducer),
});


render(counterListReducer, CounterList, document.getElementById('app'));
