import parse from 'expression-parser/parse';
import { fromAST } from 'expression-parser/func';
import { d, t, createUpdater, render } from '../../xxs';
import { o } from './helpers';
import {
  Scale,
  init as scaleInit,
  updater as scaleUpdater
} from './scale';
import {
  Name,
  init as getNameInit,
  updater as nameUpdater,
  getValue,
  getQuery as getNameQuery,
  updateFromQuery as updateNameFromQuery,
} from './name';

const [ div, input, pre ] = ['div', 'input', 'pre'].map(d);

const INPUT = Symbol('INPUT');
const NAME_ACTION = Symbol('NAME_ACTION');
const SCALE_ACTION = Symbol('SCALE_ACTION');


console.log('SCALEINIT???', scaleInit);


const Input = (state, dispatch) => {
  console.log('scaley', state.scale);
  const { ast, parseErr } = parseWhatWeCan(state.expression);
  const names = getNames(ast);

  return div({}, [
    div({}, [Scale({
      ast: ast,
      context: names.reduce((context, name) =>
        Object.assign(context, { [name]: getValue(state.nameStates[name]) }), {}),
      scale: state.scale,
    }, (action, payload) => dispatch(SCALE_ACTION, { action, payload }))]),
    div({}, [
      input({ events: {
        input: e => dispatch(INPUT, e.target.value),
      }, attrs: {
        value: state.expression
      }}),
    ]),
    div({}, [t(parseErr || '')]),
    div({}, names.map((name, i) =>
      Name(state.nameStates[name], (action, payload) =>
        dispatch(NAME_ACTION, { action, payload, name })))),
  ]);
};

const init = {
  expression: '',
  names: [],
  nameStates: {},
  scale: scaleInit,
};


function parseWhatWeCan(expr) {
  let parseErr = null;
  let ast;
  let slice = expr.length;
  if (slice !== (slice|0)) {
    throw new Error(`Could not get the expression length with expression '${JSON.stringify(expr)}'`);
  }

  while (true) {
    try {
      ast = parse(expr.slice(0, slice));
      break;
    } catch (err) {
      parseErr = err.toString();
      slice -= 1;
    }
  }
  return {
    ast,
    parseErr,
  };
}


function getNames(ast, names = []) {
  if (ast.node === 'name') {
    names = names.concat(ast.options.key);
  }
  names = names.concat(...ast.children.map(node => getNames(node)));
  return names.filter((n, i) => names.indexOf(n) === i);
}


const updater = createUpdater({
  [INPUT]: (state, newExpr) => {
    const { ast, parseErr } = parseWhatWeCan(newExpr);
    const names = getNames(ast);
    const nameStates = names
      .filter(name => !(name in state.nameStates))
      .reduce((states, newName) =>
        o.set(states, newName, getNameInit(newName)),
        state.nameStates);
    return o.update({
      expression: newExpr,
      nameStates,
    });
  },
  [SCALE_ACTION]: (state, { action, payload }) =>
    o.set(state, 'scale', scaleUpdater(state.scale, action, payload)),
  [NAME_ACTION]: (state, { action, payload, name }) =>
    o.set(state, 'nameStates',
      o.set(state.nameStates, name, nameUpdater(state.nameStates[name], action, payload))),
});


const getQuery = state => {
  console.log('gqstate', state);
  const { expression, nameStates } = state;
  const { ast } = parseWhatWeCan(expression);
  const names = getNames(ast);

  let query = { expression };
  const nameQueries = names.forEach(name =>
    query = o.update(query, getNameQuery(nameStates[name])));
  return query;
};


const updateFromQuery = (state, query) => {
  const names = Object.keys(query).filter(k => k !== 'expression');
  const update = {
    expression: query.expression || '',
    nameStates: {},
  };
  names.forEach(name => {
    const currentNameState = state.nameStates[name] || getNameInit(name);
    update.nameStates[name] = updateNameFromQuery(currentNameState, query)
  });
  return update;
}


const URL_UPDATE = Symbol('URL_UPDATE');


const toQuery = obj => {
  return Object.keys(obj)
    .map(k => `${k}=${encodeURIComponent(obj[k])}`)
    .join('&');
};


const updateURL = (function() {
  let nextValue = '',
      timer = null;
  return function(v) {
    nextValue = v;
    if (timer === null) {
      timer = setTimeout(() => {
        history.replaceState(null, '', `${window.location.pathname}?${nextValue}`);
        timer = null;
      }, 333);
    }
  };
})();


const queryMw = next => (state, action, payload) => {
  let nextState;
  if (action === URL_UPDATE) {
    nextState = updateFromQuery(state, payload);
  } else {
    nextState = next(state, action, payload);
  }
  updateURL(toQuery(getQuery(nextState)));
  return nextState;
};


const dispatch = render(Input, init, updater, document.getElementById('app'), [queryMw]);


const handleURLChange = () => {
  const [ _, query ] = window.location.search.split('?');
  if (typeof query === 'undefined') {
    return {};
  }
  const queryObj = query
    .split('&')
    .map(kv => kv.split('='))
    .map(([k, v]) => ({ [k]: decodeURIComponent(v || '') }))
    .reduce((o, next) => Object.assign(o, next), {});
  dispatch(URL_UPDATE, queryObj);
};

window.addEventListener('popstate', handleURLChange);
handleURLChange();
