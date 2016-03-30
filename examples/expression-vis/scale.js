import { d, t, createUpdater } from '../../xxs';
import { o } from './helpers';
import { Bars } from './bars';
const [ div, label, input ] = ['div', 'label', 'input'].map(d);


const CHANGE_SCALE = Symbol('CHANGE_SCALE');
const CHANGE_MODE = Symbol('CHANGE_MODE');


export const init = {
  scale: '12',
  mode: 'linear',
};


export const Scale = ({ ast, context, scale }, dispatch) => {
  console.log('scale', scale);
  const parsedScale = parseFloat(scale.scale);
  return div({ attrs: { 'class': 'scale' } }, [
    div({}, [
      label({ attrs: { 'for': 'scale-view-linear' } }, [t('Linear')]),
      input({ attrs: {
        id: 'scale-view-linear',
        name: 'scale-view',
        type: 'radio',
        value: 'linear',
      }, events: {
        input: e => dispatch(CHANGE_MODE, 'linear'),
      } }, []),

      label({ attrs: { 'for': 'scale-view-log' } }, [t('Log')]),
      input({ attrs: {
        id: 'scale-view-log',
        name: 'scale-view',
        type: 'radio',
        value: 'log',
      }, events: {
        input: e => dispatch(CHANGE_MODE, 'log'),
      } }, []),

      label({ attrs: { 'for': 'scale' } }, [t('Scale')]),
      input({ attrs: {
        id: 'scale',
        ming: 0,
        max: 100,
        step: 'any',
        type: 'range',
        value: scale.scale
      }, events: {
        input: e => dispatch(CHANGE_SCALE, e.target.value)
      } }, [])
    ]),
    Bars({
      node: ast,
      context,
      scale: parsedScale
    }),
  ]);
};


export const updater = createUpdater({
  [CHANGE_SCALE]: (state, newValue) => o.set(state, 'scale', newValue),
  [CHANGE_MODE]: (state, newValue) => o.set(state, 'mode', newValue),
});
