import { basename } from 'path';
import astWalk from './astWalk';
import parseJS from './parseJS';

export default function optimizer(source: string) {
  const baseSourceFileName = basename(source);
  const compiledSource = baseSourceFileName.replace(/\.ts$/, '.js');
  const { ast, code } = parseJS(compiledSource);
  const output = astWalk(ast, code, true);

  return output;
}
