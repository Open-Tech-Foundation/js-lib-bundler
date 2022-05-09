#!/usr/bin/env node

const { bundler } = require("./dist/bundler.cjs");
const pkg = require("./package.json");

console.log("Bundler started");

bundler(pkg);

console.log("Bundler completed");
