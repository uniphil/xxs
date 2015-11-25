'use strict';

// Upon my {verb1} him, he immediately {verb2}, {verb3} {adverb1}, {verb4} against my {noun1}, and appeared {adjectives1} with my {noun2}.
// This, then, was the very {noun3} of which I was in search.
// I at once offered to {verb5} it of the {noun4}; but this {noun4} made no claim to it—knew nothing of it—had never {verb6} it before.

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
        keyup: e => connect(wordEntryActions.KEYUP)(document.getElementById(state.type).value),
      } }),
      button({ attrs: { type: 'submit' } }, [t('submit')]),
      t(`${state.needed - state.collected.length} left`),
    ]);
  } else {
    const v = state.collected;
    return t(`Upon my ${v[0]} him, he immediately ${v[1]}, ${v[2]} loudly, ${v[3]} against my hand, and appeared delighted with my notice. ` +
      `This then, was the very creature of which I was in search. ` +
      `I at once offered to ${v[4]} it of the landlord, but this person made no claim of it—knew nothing of it—had never ${v[5]} it before.`);
  }
};


const wordEntryReducer = createReducer({
  currentValue: '',
  type: 'verb',
  needed: 6,
  collected: [],
}, {
  [wordEntryActions.SUBMIT]: state => update(state, {
    collected: state.collected.concat([state.currentValue]),
    currentValue: ''
  }),
  [wordEntryActions.KEYUP]: (state, nextValue) =>
    set(state, 'currentValue', nextValue),
});


render(wordEntryReducer, WordTypeEntry, document.getElementById('app'));
