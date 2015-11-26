const DECREMENT = Symbol('DECREMENT');
const INCREMENT = Symbol('INCREMENT');


const Counter = connect => state =>
  div({}, [
    button({
      events: {
        click: connect(DECREMENT),
      },
    }, [t('-')]),
    t(state),
    button({
      events: {
        click: connect(INCREMENT),
      },
    }, [t('+')]),
  ]);


const counterReducer = createReducer(0, {
  [DECREMENT]: state => state - 1,
  [INCREMENT]: state => state + 1,
});


render(counterReducer, Counter, document.getElementById('app'))
