import mkFunc from 'expression-parser/func';
import { d, t, createUpdater } from '../../xxs';
import { o } from './helpers';
const [ div ] = ['div'].map(d);


const interleave = (text, inserts) => {
  const mergedLen = inserts.length * 2 + 1;
  const merged = Array(mergedLen);
  for (let i = 0; i < inserts.length; i++) {
    merged[i * 2] = text[i];
    merged[i * 2 + 1] = inserts[i];
  }
  merged[mergedLen - 1] = text[text.length - 1];
  return merged;
};


export const Bars = ({ node, context, scale }) => {
  const printPieces = node.template.split('#').map(t);
  const childPieces = node.children.map(child => Bars({ node: child, context, scale }));
  const height = mkFunc.fromAST(node)(context) * scale;
  const above = height >= 0;
  return div({ attrs: {
    'class': 'bar',
    'style': `height: ${Math.abs(height)}px; background: hsla(${ above ? '80' : '350'}, 100%, 60%, 0.1)`,
  } }, interleave(printPieces, childPieces));
};
