import { readFileSync } from 'fs';
import { parse } from '@babel/parser';
import { resolve } from 'path';

export default function parseJS(path: string) {
  const sourceFilename = resolve(process.cwd(), '.bundler', path);
  const code = readFileSync(sourceFilename, {
    encoding: 'utf-8',
  });

  return parse(code, {
    sourceType: 'module',
    sourceFilename,
  });
}
