# Extra-extra-small

Just what the world needs, another javascript framework.


## Hello world

```js
import { d, t, createUpdater, render } from 'xxs';
const div = d('div');
const button = d('button');

const INCREMENT = Symbol('INCREMENT');

const Counter = (state, dispatch) =>
  div({}, [
    button({ events: { click: () => dispatch(INCREMENT) } }, [
      t('+1!'),
    ]),
    t(` The button has been clicked ${state} times.`),
  ]);

const updater = createUpdater({
  [INCREMENT]: state => state + 1,
});

render(
  Counter,  // the component to display
  0,        // its initial render state
  updater,  // handles state updates in response to dispatches
  document.getElementById('app')  // where to attach the app on the page
);
```
