import { writeFileSync } from 'fs';
import { join } from 'path';

import compileTS from './compileTS';
import parse from './parse';

export default function bundler(pkg: Record<string, unknown>) {
  console.log('Compiling TypeScript');

  const emitSkipped = compileTS(pkg.source as string);

  if (emitSkipped) {
    console.log('TypeScript compilation failed!');
    return;
  }

  console.log('TypeScript compilation done!');

  const output = parse(pkg.source as string);

  writeFileSync(join(process.cwd(), pkg.module as string), output);
}
