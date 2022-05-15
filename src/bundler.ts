import { writeFileSync } from 'fs';
import { join } from 'path';

import compileTS from './compileTS';
import optimizer from './optimizer';

export default function bundler(pkg: Record<string, unknown>) {
  console.log('Compiling TypeScript');

  const emitSkipped = compileTS(pkg.source as string);

  if (emitSkipped) {
    console.log('TypeScript compilation failed!');
    return;
  }

  console.log('TypeScript compilation done!');

  const output = optimizer(pkg.source as string);

  writeFileSync(join(process.cwd(), pkg.exports as string), output);
}
