import { readFileSync } from 'fs';
import { parse } from '@babel/parser';
import { join } from 'path';

export default function parseJS(path: string) {
  const code = readFileSync(join(process.cwd(), '.bundler', path), {
    encoding: 'utf-8',
  });
  const result = parse(code, {
    sourceType: 'module',
  });
  return { ast: result, code };
}
