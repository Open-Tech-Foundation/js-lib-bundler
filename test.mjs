#!/usr/bin/env node

import { bundler } from "./dist/bundler.mjs";

import pkg from './package.json' assert { type: 'json' };

console.log("Bundler started");

bundler(pkg);

console.log("Bundler completed");
