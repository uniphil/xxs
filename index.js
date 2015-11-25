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
      placeholder: state.hint,
      type: 'text',
      value: state.currentValue,
    }, events: {
      input: e => connect(wordEntryActions.KEYUP)(e.target.value),
    } }),
    state.currentValue.length > 0
      ? button({ attrs: { type: 'submit' } }, [
          strong({}, [t('add')]),
          t(` (${state.needed - state.collected.length} left)`),
        ])
      : button({ attrs: { disabled: true } }, [
          strong({}, [t('⬅ type a word')])
        ])
  ]);


const WordTypeEntry = connect => state => {
  if (state.needed === 0) {
    return t('');
  } else {
    return div({ attrs: {
        'class': 'word-entry',
      }}, [
        wordTypeReady(state)
          ? p({}, [t(`✓ ${state.type}s completed!`)])
          : WordEntry(connect)(state)
      ]);
  }
};


const wordEntryReducer = (type, hint, needed) => createReducer({
  currentValue: '',
  type,
  hint,
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
  const title = h1({}, [t('Mad Lib')]);
  if (state.wordTypes.every(wordTypeReady)) {
    const verbs = state.wordTypes[0].collected,
          adverbs = state.wordTypes[1].collected,
          nouns = state.wordTypes[2].collected,
          adjectives = state.wordTypes[3].collected;
    return div({}, [
      title,
      p({ attrs: { 'class': 'story' }}, [
        t(`"It is ${adjectives[0]}!" ${verbs[0]}ed the ${nouns[0]} ` +
          `${verbs[1]}ing in the ${nouns[1]}. But in the ${adjectives[1]} ` +
          `${nouns[2]}s the ${nouns[3]}s ${verbs[2]}ed their ${nouns[4]} and ` +
          `${verbs[3]}ed at one another. "It is ${adjectives[2]}," they ` +
          `said. "${adjectives[2].toUpperCase()}!"`) ]),
      button({ attrs: {
        'class': 'again',
      }, events: {
        click: connect(madlibActions.RESET)
      } }, [t('New Mad Lib!')]),
    ]);
  } else {
    return div({}, [
      title,
      div({}, WordTypeEntries.render(connect)(state.wordTypes)),
    ]);
  }
};

const madInitialState = {
  wordTypes: [
    wordEntryReducer('verb', 'run, jump...', 4)(),
    wordEntryReducer('adverb', 'quickly, easily...', 0)(),
    wordEntryReducer('noun', 'dog, city, trumpet...', 5)(),
    wordEntryReducer('adjective', 'red, loud, hard...', 3)(),
  ],
};

const madLibReducer = createReducer(madInitialState, {
  [madlibActions.RESET]: () => madInitialState,
  [WordTypeEntries.ACTION]: (state, payload) =>
    set(state, 'wordTypes', WordTypeEntries.forward(wordEntryReducer())(
      state.wordTypes, payload))
});


render(madLibReducer, MadLib, document.getElementById('app'));
