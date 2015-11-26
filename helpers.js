(function(global) {

  function setAt(arr, i, v) {
    const copy = arr.slice();
    copy[i] = v;
    return copy;
  }


  const update = (obj, changes) => Object.assign({}, obj, changes);
  const set = (obj, key, val) => update(obj, { [key]: val });


  const isInObj = things => thing =>
    Object.keys(things).some(t => things[t] === thing);


  function ListOf(Component, actions, updaters) {
    const wrapperAction = Symbol(`LIST ACTIONS {${Object.keys(actions).join(', ')}}`);
    const isInActions = isInObj(actions);
    const reducer = createUpdater(updaters);
    return {
      ACTION: wrapperAction,
      render: (state, dispatch) =>
        state.map((stateItem, i) =>
          Component(stateItem, (action, payload) =>
            isInActions(action)
              ? dispatch(wrapperAction, { action, payload, i })
              : dispatch(action, payload))),
      forward: (state, payload) =>
        setAt(state, payload.i,
          reducer(state[payload.i], payload.action, payload.payload)),
    };
  }


  Object.assign(global, {
    update,
    set: set,
    setAt,
    ListOf,
  });

})(window);
