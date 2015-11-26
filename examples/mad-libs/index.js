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


const WordEntry = (state, dispatch) =>
  d.form({ events: {
    submit: e => {
      e.preventDefault();
      dispatch(wordEntryActions.SUBMIT);
    },
  } }, [
    d.label({ attrs: { 'for': state.type } }, [t(state.type)]),
    d.input({ attrs: {
      id: state.type,
      placeholder: state.hint,
      type: 'text',
      value: state.currentValue,
    }, events: {
      blur: () => dispatch(wordEntryActions.BLUR),
      focus: () => dispatch(wordEntryActions.FOCUS),
      input: e => dispatch(wordEntryActions.CHANGE, e.target.value),
    } }),
    state.focused || state.currentValue.length > 0
      ? d.button({ attrs: state.currentValue.length === 0
          ? { type: 'submit', disabled: true }
          : { type: 'submit' }
        }, [
          d.strong({}, [t('Add')]),
          t(` (${state.needed - state.collected.length} left)`),
        ])
      : d.button({ attrs: { disabled: true } }, [
          d.strong({}, [t('⬅ type a word')])
        ])
  ]);


const WordTypeEntry = (state, dispatch) => {
  if (state.needed === 0) {
    return t('');
  } else {
    return d.div({ attrs: {
        'class': 'word-entry',
      }}, [
        wordTypeReady(state)
          ? d.p({}, [t(`✓ ${state.type}s completed!`)])
          : WordEntry(state, dispatch)
      ]);
  }
};


const getWordEntryInit = (type, hint, needed) => ({
  currentValue: '',
  type,
  hint,
  needed,
  collected: [],
  focused: false,
});


const wordEntryUpdates = createUpdater({
  [wordEntryActions.SUBMIT]: state =>
    o.update(state, {
      collected: state.collected.concat([state.currentValue]),
      currentValue: ''
    }),
  [wordEntryActions.CHANGE]: (state, nextValue) =>
    o.set(state, 'currentValue', nextValue),
  [wordEntryActions.FOCUS]: state =>
    o.set(state, 'focused', true),
  [wordEntryActions.BLUR]: state =>
    o.set(state, 'focused', false),
});


//////

const madlibActions = {
  RESET: Symbol('RESET'),
  ENTRY_ACTION: Symbol('ENTRY_ACTION'),
};


const MadLib = (state, dispatch) => {
  if (state.wordTypes.every(wordTypeReady)) {
    const verbs = state.wordTypes[0].collected,
          adverbs = state.wordTypes[1].collected,
          nouns = state.wordTypes[2].collected,
          adjectives = state.wordTypes[3].collected;
    return d.div({}, [
      d.h1({}, [t(state.title)]),
      d.h2({}, [t(`by ${state.author}`)]),
      d.p({ attrs: { 'class': 'story' }}, [
        t(state.print(
          state.wordTypes[0].collected,
          state.wordTypes[1].collected,
          state.wordTypes[2].collected,
          state.wordTypes[3].collected)) ]),
      d.button({ attrs: {
        'class': 'again',
      }, events: {
        click: () => dispatch(madlibActions.RESET)
      } }, [t('New Mad Lib!')]),
    ]);
  } else {
    return d.div({}, [
      d.h1({}, [t('Mad Libs')]),
      d.div({}, state.wordTypes.map((entryState, i) =>
        WordTypeEntry(entryState, (action, payload) =>
          dispatch(madlibActions.ENTRY_ACTION, { action, payload, i })))),
    ]);
  }
};


const getMadInit = () => {
  const i = Math.floor(Math.random() * stories.length);
  const story = stories[i];
  const counts = story.wordCounts;
  return {
    title: story.title,
    author: story.author,
    print: story.print,
    wordTypes: [
      getWordEntryInit('verb', 'run, jump...', counts.verbs),
      getWordEntryInit('adverb', 'quickly, easily...', counts.adverbs),
      getWordEntryInit('noun', 'dog, city, trumpet...', counts.nouns),
      getWordEntryInit('adjective', 'red, loud, hard...', counts.adjectives),
    ],
  };
};

const madUpdates = createUpdater({
  [madlibActions.RESET]: () => getMadInit(),
  [madlibActions.ENTRY_ACTION]: (state, payload) =>
    o.set(state, 'wordTypes',
      a.setAt(state.wordTypes, payload.i,
        wordEntryUpdates(state.wordTypes[payload.i], payload.action, payload.payload))),
});


render(MadLib, getMadInit(), madUpdates, document.getElementById('app'));
