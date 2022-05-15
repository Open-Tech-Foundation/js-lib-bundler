/* eslint-disable @typescript-eslint/no-var-requires */
const { rmSync, readFileSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const { bundler } = require('../dist/bundler.cjs');
const jsonToFiles = require('./jsonToFiles.js');

const tempDir = join(tmpdir(), 'js-lib-bundler', 'lib');

beforeEach(() => {
  const cwdSpy = jest.spyOn(process, 'cwd');
  cwdSpy.mockReturnValue(tempDir);
  rmSync(tempDir, { recursive: true, force: true });
});

describe('Bundler', () => {
  test('Single JS file with an expression', () => {
    jsonToFiles(tempDir, {
      'module.js': `console.log("Hello World!")`,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('Single JS file with a function', () => {
    jsonToFiles(tempDir, {
      'module.js': `function a() { return "Hello World!" }`,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('Single JS file with export default function', () => {
    jsonToFiles(tempDir, {
      'module.js': `export default function a() { return "Hello World!" }`,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('Single JS file with a function & seperate default exp', () => {
    jsonToFiles(tempDir, {
      'module.js': `function a() { 
        return "Hello World!" 
      }
      
      export default a
      `,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('Single JS file with a function & named export', () => {
    jsonToFiles(tempDir, {
      'module.js': `function a() { 
        return "Hello World!" 
      }
      
      export {a}
      `,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('Single JS file with a const & function export', () => {
    jsonToFiles(tempDir, {
      'module.js': `export const name = 'square';

      export function draw(ctx, length, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, length, length);
      
        return {
          length: length,
          x: x,
          y: y,
          color: color
        };
      }      
      `,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test.only('import default function from a JS file in another', () => {
    jsonToFiles(tempDir, {
      'module.js': `import a from './a';
      
      export default function main() {
        a()
      }`,
      'a.js': `export default function a() {
        console.log("From a")
      }`,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('import a const from a JS file in another', () => {
    jsonToFiles(tempDir, {
      'module.js': `import {CONSTANT} from './a';
      
      export default function main() {
        console.log(CONSTANT)
      }`,
      'a.js': `export const CONSTANT = 1.0`,
    });
    bundler({ source: 'module.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });
});
