(function(global) {

  function setAt(arr, i, v) {
    const copy = arr.slice();
    copy[i] = v;
    return copy;
  }


  const isInObj = things => thing =>
    Object.keys(things).some(t => things[t] === thing);


  function ListOf(Component, actions) {
    const wrapperAction = Symbol('LIST ACTION (wrapper)');
    const isInActions = isInObj(actions);
    return {
      ACTION: wrapperAction,
      render: connect => state => {
        const actionWrapper = connect(wrapperAction);
        return state.map((s, i) =>
          Component(action =>
            isInActions(action)
              ? payload => actionWrapper({ action, payload, i })
              : connect(action)
          )(state[i]))
      },
      forward: reducer => (state, payload) => {
        return setAt(state, payload.i,
          reducer(state[payload.i], payload.action, payload.payload));
      },
    };
  }


  Object.assign(global, {
    ListOf
  });

})(window);
