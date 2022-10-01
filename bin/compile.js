#!/usr/bin/env node
const semver = require('semver');
const package = require('../package.json');

const engineVersion = package.engines.node;

if (!semver.satisfies(process.version, engineVersion)) {
  console.log(`Required node version ${engineVersion} not satisfied with current version ${process.version}.`);
  process.exit(1);
}

const build = require('../out/build').default;
const program = require('commander').program;
const version = require('../package.json').version;
let options = {};

program.version(version);
program
	.arguments('<filepath>')
	.arguments('[output]')
	.description('Compiler for Greyscript.', {
		filepath: 'File to compile',
		output: 'Output directory'
	})
	.action(function (filepath, output) {
		options.filepath = filepath;
		options.output = output || '.';
	})
	.option('-ev, --env-files <file...>', 'Environment variables files')
	.option('-vr, --env-vars <var...>', 'Environment variables')
	.option('-en, --exclude-namespaces <namespace...>', 'Exclude namespaces from optimization')
	.option('-dlo, --disable-literals-optimization', 'Disable literals optimization')
	.option('-dno, --disable-namespaces-optimization', 'Disable namespace optimization')
	.option('-u, --uglify', 'Uglify your code')
	.option('-b, --beautify', 'Beautify your code')
	.option('-o, --obfuscation', 'Enable obfuscation')
	.option('-i, --installer', 'Create installer for GreyScript (Should be used if you use import_code)')
	.option('-mc, --maxChars <number>', 'Amount of characters allowed in one file before splitting when creating installer');

program.parse(process.argv);

(function() {
	options = Object.assign(options, program.opts());

	const success = build(options.filepath, options.output, {
		envFiles: options.envFiles,
		envVars: options.envVars,
		uglify: options.uglify,
		beautify: options.beautify,
		obfuscation: options.obfuscation,
		disableLiteralsOptimization: options.disableLiteralsOptimization,
		disableNamespacesOptimization: options.disableNamespacesOptimization,
		excludedNamespaces: options.excludeNamespaces,
		name: options.name,
		installer: options.installer,
		maxChars: options.maxChars
	});

	if (!success) {
		process.exit(1);
	}
})();