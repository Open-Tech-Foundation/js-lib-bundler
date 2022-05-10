import { readFileSync } from 'fs';
import { parse } from '@babel/parser';

export default function parseJS(path: string) {
  const code = readFileSync(path, { encoding: 'utf-8' });
  const result = parse(code, {
    sourceType: 'module',
  });
  return { ast: result, code };
}
