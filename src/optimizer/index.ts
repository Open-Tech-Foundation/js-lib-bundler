import { basename } from 'path';
import concatModules from './concatModules';
import parseJS from './parseJS';
import treeShake from './treeShake';

export default function optimizer(source: string) {
  const baseSourceFileName = basename(source);
  const compiledSource = baseSourceFileName.replace(/\.ts$/, '.js');
  const ast = parseJS(compiledSource);
  const idMap = new Map();
  let output = concatModules(ast, idMap, true);

  console.log(idMap);

  output = treeShake(output);

  output = output.trim();

  return output + '\n';
}
