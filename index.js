'use strict';

const wordTypeReady = wordTypeState =>
  wordTypeState.collected.length === wordTypeState.needed


const wordEntryActions = {
  SUBMIT: Symbol('SUBMIT'),
  KEYUP: Symbol('KEYUP'),
};

const WordTypeEntry = connect => state => {
  if (!wordTypeReady(state)) {
    return form({ events: {
      submit: e => {
        e.preventDefault();
        connect(wordEntryActions.SUBMIT)();
      },
    } }, [
      label({ attrs: { 'for': state.type } }, [t(state.type)]),
      input({ attrs: {
        id: state.type,
        type: 'text',
        value: state.currentValue,
      }, events: {
        input: e => connect(wordEntryActions.KEYUP)(document.getElementById(state.type).value),
      } }),
      button({ attrs: { type: 'submit' } }, [t('add')]),
      t(`${state.needed - state.collected.length} left`),
    ]);
  } else {
    return p({}, [t(`${state.type}s completed!`)]);
  }
};


const wordEntryReducer = (type, needed) => createReducer({
  currentValue: '',
  type,
  needed,
  collected: [],
}, {
  [wordEntryActions.SUBMIT]: state => update(state, {
    collected: state.collected.concat([state.currentValue]),
    currentValue: ''
  }),
  [wordEntryActions.KEYUP]: (state, nextValue) =>
    set(state, 'currentValue', nextValue),
});


//////

const madlibActions = {
  RESET: Symbol('RESET'),
};


const WordTypeEntries = ListOf(WordTypeEntry, wordEntryActions);

const MadLib = connect => state => {
  if (state.wordTypes.every(wordTypeReady)) {
    const vs = state.wordTypes[0].collected;
    const av = state.wordTypes[1].collected;
    const ns = state.wordTypes[2].collected;
    const aj = state.wordTypes[3].collected;
    return div({}, [
      p({}, [
        t(`"It is ${aj[0]}!" ${vs[0]}ed the ${ns[0]} ${vs[1]}ing in the ${ns[1]}. ` +
          `But in the ${aj[1]} ${ns[2]}s the ${ns[3]}s ${vs[2]}ed their ${ns[4]} and ${vs[3]}ed at one another. ` +
          `"It is ${aj[2]}," they said. "${aj[2]}!"`) ]),
      button({ events: {
        click: connect(madlibActions.RESET)
      } }, [t('again')]),
    ]);
  } else {
    return div({}, WordTypeEntries.render(connect)(state.wordTypes));
  }
};

const madInitialState = {
  wordTypes: [
    wordEntryReducer('verb', 4)(),
    wordEntryReducer('adverb', 0)(),
    wordEntryReducer('noun', 5)(),
    wordEntryReducer('adjective', 3)(),
  ],
};

const madLibReducer = createReducer(madInitialState, {
  [madlibActions.RESET]: () => madInitialState,
  [WordTypeEntries.ACTION]: (state, payload) =>
    set(state, 'wordTypes', WordTypeEntries.forward(wordEntryReducer())(
      state.wordTypes, payload))
});


render(madLibReducer, MadLib, document.getElementById('app'));
