#!/usr/bin/env node
const semver = require('semver');
const package = require('../package.json');

const engineVersion = package.engines.node;

if (!semver.satisfies(process.version, engineVersion)) {
	console.log(`Required node version ${engineVersion} not satisfied with current version ${process.version}.`);
	process.exit(1);
}

const program = require('commander').program;
const version = package.version;

let options = {};

program.version(version);
program
	.description('Web UI.');

program.parse(process.argv);

(function() {
	options = Object.assign(options, program.opts());

	const open = require('open');
	const path = require('path');

	open(path.resolve(__dirname, '../out/index.html'));
})();