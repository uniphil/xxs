import { d, t, createUpdater } from '../../xxs';
import { o } from './helpers';
const [ button,  div,  input,  label,  span ] =
      ['button','div','input','label','span'].map(d);

const CHANGE_VALUE = Symbol('CHANGE_VALUE');
const CHANGE_MIN = Symbol('CHANGE_MIN');
const CHANGE_MAX = Symbol('CHANGE_MAX');
const TOGGLE_MODE = Symbol('TOGGLE_MODE');


export const init = name => ({
  mode: 'constant',
  name: name,
  value: 1,
  min: 0,
  max: 10,
});


export const Name = (state, dispatch) =>
  div({ attrs: {
    'class': `name ${state.mode}`,
  } }, [
    label({ attrs: {
      'class': 'value-label',
      'for': `name-${state.name}`,
    } }, [t(state.name)]),
    button({ events: {
      click: () => dispatch(TOGGLE_MODE)
    } }, [
      t(state.mode === 'constant' ? 'const' : 'var'),
    ]),
    ...(state.mode === 'constant')
      ? [
          input({ attrs: {
            'class': 'constant value',
            id: `name-${state.name}`,
            step: 'any',
            type: 'number',
            value: String(state.value),
          }, events: {
            input: e => dispatch(CHANGE_VALUE, parseFloat(e.target.value)),
          }})
        ]
      : [
          label({ attrs: {
            'class': 'min-max-label',
            'for': `name-${state.name}-min`,
          } }, [t('min: ')]),
          input({ attrs: {
            'class': 'min',
            id: `name-${state.name}-min`,
            step: 'any',
            type: 'number',
            value: String(state.min),
          }, events: {
            input: e => dispatch(CHANGE_MIN, parseFloat(e.target.value)),
          }}),
          input({ attrs: {
            'class': 'variable value',
            id: `name-${state.name}`,
            max: String(state.max),
            min: String(state.min),
            step: 'any',
            type: 'range',
            value: String(state.value),
          }, events: {
            input: e => dispatch(CHANGE_VALUE, parseFloat(e.target.value)),
          } }),
          label({ attrs: {
            'class': 'min-max-label',
            'for': `name-${state.name}-max`,
          } }, [t('max: ')]),
          input({ attrs: {
            'class': 'max',
            id: `name-${state.name}-max`,
            step: 'any',
            type: 'number',
            value: String(state.max),
          }, events: {
            input: e => dispatch(CHANGE_MAX, parseFloat(e.target.value)),
          }}),
        ],
  ]);


export const updater = createUpdater({
  [CHANGE_VALUE]: (state, newValue) => o.update(state, {
    min: Math.min(state.min, newValue),
    max: Math.max(state.max, newValue),
    value: newValue
  }),
  [CHANGE_MIN]: (state, newMin) => o.update(state, {
    min: newMin,
    max: Math.max(state.max, newMin),
    value: Math.max(state.value, newMin),
  }),
  [CHANGE_MAX]: (state, newMax) => o.update(state, {
    max: newMax,
    min: Math.min(state.min, newMax),
    value: Math.min(state.value, newMax),
  }),
  [TOGGLE_MODE]: state =>
    state.mode === 'constant'
      ? o.update(state, {
          mode: 'variable',
          min: Math.min(state.min, state.value),
          max: Math.max(state.max, state.value),
        })
      : o.set(state, 'mode', 'constant'),
});


export const getValue = state => state.value;

export const getQuery = state => ({
  [state.name]: [
    state.mode,
    String(state.min),
    String(state.value),
    String(state.max),
  ].join('|'),
});

export const updateFromQuery = (state, query) => {
  if (!(state.name in query)) {
    return state;
  }
  const [ mode, min, value, max ] = query[state.name].split('|');
  return o.update(state, {
    mode,
    min: parseFloat(min),
    value: parseFloat(value),
    max: parseFloat(max),
  });
};
