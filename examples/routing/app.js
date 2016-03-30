import { d, t, createUpdater, render } from '../../xxs';
import { o } from './helpers';
const [ div, p ] = ['div', 'p'].map(d);


const App = (state, dispatch) =>
  div({ attrs: { 'class': 'app' } }, [
    p({}, [t(`hello ${state.name}`)]),
  ]);


const stack = {

};


const dispatch = render(App, init, updater, document.getElementById('app'));
