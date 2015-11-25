'use strict';

const wordTypeReady = wordTypeState =>
  wordTypeState.collected.length === wordTypeState.needed


const wordEntryActions = {
  SUBMIT: Symbol('SUBMIT'),
  KEYUP: Symbol('KEYUP'),
};


const WordEntry = connect => state =>
  form({ events: {
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
      input: e => connect(wordEntryActions.KEYUP)(e.target.value),
    } }),
    button({ attrs: { type: 'submit' } }, [
      strong({}, [t('add')]),
      t(` (${state.needed - state.collected.length} left)`),
    ]),
  ]);


const WordTypeEntry = connect => state =>
  div({ attrs: {
    className: 'word-entry',
  }}, [
    wordTypeReady(state)
      ? p({}, [t(`${state.type}s completed!`)])
      : WordEntry(connect)(state)
  ]);


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
    const verbs = state.wordTypes[0].collected,
          adverbs = state.wordTypes[1].collected,
          nouns = state.wordTypes[2].collected,
          adjectives = state.wordTypes[3].collected;
    return div({}, [
      p({}, [
        t(`"It is ${adjectives[0]}!" ${verbs[0]}ed the ${nouns[0]} ` +
          `${verbs[1]}ing in the ${nouns[1]}. But in the ${adjectives[1]} ` +
          `${nouns[2]}s the ${nouns[3]}s ${verbs[2]}ed their ${nouns[4]} and ` +
          `${verbs[3]}ed at one another. "It is ${adjectives[2]}," they ` +
          `said. "${adjectives[2]}!"`) ]),
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
