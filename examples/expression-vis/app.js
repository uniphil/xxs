import { d, t, createUpdater, render } from '../../xxs';
import { o } from './helpers';
const [ div, p ] = ['div', 'p'].map(d);


const App = (state, dispatch) =>
  div({ attrs: { 'class': 'app' } }, [
    p({}, [t(`hello ${state.name}`)]),
  ]);


const init = {
  name: 'friend',
};


const CHANGE_NAME = Symbol('CHANGE_NAME');


const updater = createUpdater({
  [CHANGE_NAME]: (state, payload) => o.set(state, 'name', payload),
});


const dispatch = render(App, init, updater, document.getElementById('app'));
