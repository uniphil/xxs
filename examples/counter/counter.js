const t = xxs.t;
const div = xxs.d('div');
const button = xxs.d('button');

const DECREMENT = Symbol('DECREMENT');
const INCREMENT = Symbol('INCREMENT');


const Counter = (state, dispatch) =>
  div({}, [
    button({
      events: {
        click: () => dispatch(DECREMENT),
      },
    }, [t('-')]),
    t(state),
    button({
      events: {
        click: () => dispatch(INCREMENT),
      },
    }, [t('+')]),
  ]);


const initialState = 0;


const actionUpdates = xxs.createUpdater({
  [DECREMENT]: state => state - 1,
  [INCREMENT]: state => state + 1,
});


xxs.render(Counter, initialState, actionUpdates, document.getElementById('app'));
