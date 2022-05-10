import { writeFileSync } from 'fs';
import astWalk from './astWalk';
import compileTS from './compileTS';
import parseJS from './parseJS';

export default function bundler(pkg: Record<string, unknown>) {
  console.log('Compiling TypeScript');

  const emitSkipped = compileTS(pkg.source as string);

  if (emitSkipped) {
    throw new Error('TypeScript compiling failed.');
  }

  const { ast, code } = parseJS(pkg.source as string);

  const output = astWalk(ast, code);

  writeFileSync(pkg.module as string, output);
}
