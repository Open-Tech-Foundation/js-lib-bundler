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
      'a.js': `console.log("Hello World!")`,
    });
    bundler({ source: 'a.js', exports: './main.js' });
    const output = readFileSync(join(tempDir, 'main.js'), {
      encoding: 'utf-8',
    });
    expect(output).toMatchSnapshot();
  });
});
