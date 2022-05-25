/* eslint-disable @typescript-eslint/no-var-requires */
const { rmSync, readFileSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const { bundler } = require('../dist/bundler.cjs');
const jsonToFiles = require('./jsonToFiles.js');
const replaceFixedUID = require('./replaceFixedUID.js');

const tempDir = join(tmpdir(), 'js-lib-bundler', 'lib');

beforeEach(() => {
  const cwdSpy = jest.spyOn(process, 'cwd');
  cwdSpy.mockReturnValue(tempDir);
  rmSync(tempDir, { recursive: true, force: true });
});

describe('Bundler', () => {
  test('A js file with an expression', () => {
    jsonToFiles(tempDir, {
      'index.js': `console.log("Hello World!")`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('A js file with a function', () => {
    jsonToFiles(tempDir, {
      'index.js': `function greet() { return "Hello World!" }`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('A js file with an export default function', () => {
    jsonToFiles(tempDir, {
      'index.js': `export default function a() { return "Hello World!" }`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('A js file with a function & a default exp', () => {
    jsonToFiles(tempDir, {
      'index.js': `function a() { 
        return "Hello World!" 
      }
      
      export default a
      `,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('A js file with a function & named export', () => {
    jsonToFiles(tempDir, {
      'index.js': `function a() { 
        return "Hello World!" 
      }
      
      export {a}
      `,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('A js file with a const & a function export', () => {
    jsonToFiles(tempDir, {
      'index.js': `export const name = 'square';

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
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('import default function from a module', () => {
    jsonToFiles(tempDir, {
      'index.js': `import a from './a';
      
      export default function main() {
        a()
      }`,
      'a.js': `export default function a() {
        console.log("From a")
      }`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('import a const from a module', () => {
    jsonToFiles(tempDir, {
      'index.js': `import {CONSTANT} from './constants';
      
      export default function main() {
        console.log(CONSTANT)
      }`,
      'constants.js': `export const CONSTANT = 1.0`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('import two consts from a module', () => {
    jsonToFiles(tempDir, {
      'index.js': `import {MY_OBJECT, MY_ARRAY} from './constants';
      
      export default function main() {
        console.log(MY_OBJECT)
        console.log(MY_ARRAY)
      }`,
      'constants.js': `export const MY_OBJECT = {key: 'value'};
      export const MY_ARRAY = ['a', 'b'];`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('import a const from multiple constants file', () => {
    jsonToFiles(tempDir, {
      'index.js': `import {MY_STRING} from './constants';
      
      export default function main() {
        console.log(MY_STRING)
      }`,
      'constants.js': `export const MY_OBJECT = {'key': 'value'};
      export const MY_STRING = 'STRING'
      export const MY_ARRAY = ['a', 'b'];`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(replaceFixedUID(output)).toMatchSnapshot();
  });

  test('import a const made of variables imported from another file', () => {
    jsonToFiles(tempDir, {
      'index.js': `import {z} from './constants';
      
      export default function main() {
        console.log(z)
      }`,
      'constants.js': `import {x, y} from './variables';
      export const z = x + y;
      export const z2 = 2;`,
      'variables.js': `export const x = 1;
      export const y = 2`,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });

  test('import a function from a module', () => {
    jsonToFiles(tempDir, {
      'index.js': `import {add} from './math';

      console.log(add(2, 3));`,
      'math.js': `export function add(a, b) {
        return a + b;
      }
      `,
    });
    bundler({ source: 'index.js', exports: './bundle.js' });
    const output = readFileSync(join(tempDir, 'bundle.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });
});
