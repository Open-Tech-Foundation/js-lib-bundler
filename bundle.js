#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { bundler } = require('./dist/bundler.cjs');
const pkg = require('./package.json');

console.log('Bundler started');

bundler(pkg);

console.log('Bundler completed');
