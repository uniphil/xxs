const DECREMENT = Symbol('DECREMENT');
const INCREMENT = Symbol('INCREMENT');


const Counter = (state, dispatch) =>
  d.div({}, [
    d.button({
      events: {
        click: () => dispatch(DECREMENT),
      },
    }, [t('-')]),
    t(state),
    d.button({
      events: {
        click: () => dispatch(INCREMENT),
      },
    }, [t('+')]),
  ]);


const initialState = 0;


const actionUpdates = createUpdater({
  [DECREMENT]: state => state - 1,
  [INCREMENT]: state => state + 1,
});


render(Counter, initialState, actionUpdates, document.getElementById('app'));
