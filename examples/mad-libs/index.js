'use strict';

const stories = [
  {
    title: 'Tales of Space and Time',
    author: 'H. G. Wells',
    wordCounts: {
      verbs: 4,
      adverbs: 0,
      nouns: 5,
      adjectives: 3,
    },
    print: (verbs, adverbs, nouns, adjectives) =>
`"It is ${adjectives[0]}!" ${verbs[0]}ed the ${nouns[0]} ${verbs[1]}ing in the
${nouns[1]}. But in the ${adjectives[1]} ${nouns[2]}s the ${nouns[3]}s
${verbs[2]}ed their ${nouns[4]} and ${verbs[3]}ed at one another. "It is
${adjectives[2]}," they said. "${adjectives[2].toUpperCase()}!"`
  },
  {
    title: 'Tales of Space and Time',
    author: 'H. G. Wells',
    wordCounts: {
      verbs: 1,
      adverbs: 1,
      nouns: 5,
      adjectives: 4,
    },
    print: (verbs, adverbs, nouns, adjectives) =>
`She was a ${adjectives[0]}, ${adjectives[1]} woman, ${adjectives[2]}er and very
much ${adjectives[3]}er than Mr. ${nouns[0]}; she ${verbs[0]}ed ${adverbs[0]},
and her ${nouns[1]} was ${adjectives[3]}ed. "That ${nouns[2]} is for sale," she
said. "And five ${nouns[3]}s is a good enough price for it. I can't think what
you're about, ${nouns[0]}, not to take the ${nouns[4]}'s offer!"`
  },
  {
    title: 'Tales of Space and Time',
    author: 'H. G. Wells',
    wordCounts: {
      verbs: 1,
      adverbs: 0,
      nouns: 3,
      adjectives: 1,
    },
    print: (verbs, adverbs, nouns, adjectives) =>
`At that Mr. ${nouns[0]}, apparently much ${adjectives[0]}ed, ${verbs[0]}ed to
the ${nouns[1]}. "Isn't it here?" he said. "Great ${nouns[2]}! what has become
of it?"`
  },
];


const wordTypeReady = wordTypeState =>
  wordTypeState.collected.length === wordTypeState.needed


const wordEntryActions = {
  BLUR: Symbol('BLUR'),
  FOCUS: Symbol('FOCUS'),
  CHANGE: Symbol('CHANGE'),
  SUBMIT: Symbol('SUBMIT'),
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
      blur: connect(wordEntryActions.BLUR),
      focus: connect(wordEntryActions.FOCUS),
      input: e => connect(wordEntryActions.CHANGE)(e.target.value),
    } }),
    state.focused || state.currentValue.length > 0
      ? button({ attrs: state.currentValue.length === 0
          ? { type: 'submit', disabled: true }
          : { type: 'submit' }
        }, [
          strong({}, [t('Add')]),
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
  focused: false,
}, {
  [wordEntryActions.SUBMIT]: state => update(state, {
    collected: state.collected.concat([state.currentValue]),
    currentValue: ''
  }),
  [wordEntryActions.CHANGE]: (state, nextValue) =>
    set(state, 'currentValue', nextValue),
  [wordEntryActions.FOCUS]: state =>
    set(state, 'focused', true),
  [wordEntryActions.BLUR]: state =>
    set(state, 'focused', false),
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
      h1({}, [t(state.title)]),
      h2({}, [t(`by ${state.author}`)]),
      p({ attrs: { 'class': 'story' }}, [
        t(state.print(
          state.wordTypes[0].collected,
          state.wordTypes[1].collected,
          state.wordTypes[2].collected,
          state.wordTypes[3].collected)) ]),
      button({ attrs: {
        'class': 'again',
      }, events: {
        click: connect(madlibActions.RESET)
      } }, [t('New Mad Lib!')]),
    ]);
  } else {
    return div({}, [
      h1({}, [t('Mad Libs')]),
      div({}, WordTypeEntries.render(connect)(state.wordTypes)),
    ]);
  }
};


const madInitialState = () => {
  const i = Math.floor(Math.random() * stories.length);
  const story = stories[i];
  const counts = story.wordCounts;
  return {
    title: story.title,
    author: story.author,
    print: story.print,
    wordTypes: [
      wordEntryReducer('verb', 'run, jump...', counts.verbs)(),
      wordEntryReducer('adverb', 'quickly, easily...', counts.adverbs)(),
      wordEntryReducer('noun', 'dog, city, trumpet...', counts.nouns)(),
      wordEntryReducer('adjective', 'red, loud, hard...', counts.adjectives)(),
    ],
  };
};

const madLibReducer = createReducer(madInitialState(), {
  [madlibActions.RESET]: () => madInitialState(),
  [WordTypeEntries.ACTION]: (state, payload) =>
    set(state, 'wordTypes', WordTypeEntries.forward(wordEntryReducer())(
      state.wordTypes, payload))
});


render(madLibReducer, MadLib, document.getElementById('app'));