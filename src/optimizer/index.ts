import { basename } from 'path';
import concatModules from './concatModules';
import parseJS from './parseJS';

export default function optimizer(source: string) {
  const baseSourceFileName = basename(source);
  const compiledSource = baseSourceFileName.replace(/\.ts$/, '.js');
  const { ast, code } = parseJS(compiledSource);
  const idMap = new Map();
  const output = concatModules(ast, code, idMap, true);

  console.log(idMap);

  return output;
}
