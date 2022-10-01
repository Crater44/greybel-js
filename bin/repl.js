#!/usr/bin/env node
const semver = require('semver');
const package = require('../package.json');

const engineVersion = package.engines.node;

if (!semver.satisfies(process.version, engineVersion)) {
  console.log(`Required node version ${engineVersion} not satisfied with current version ${process.version}.`);
  process.exit(1);
}

const repl = require('../out/repl').default;
const program = require('commander').program;
const version = package.version;
let options = {};

program.version(version);
program
	.description('REPL for Greyscript.', {});

program.parse(process.argv);

(async function() {
	options = Object.assign(options, program.opts());

	await repl();
})();