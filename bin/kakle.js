#!/usr/bin/env node

const program = require('commander');
const docs = require('../lib/docs');
const chalk = require('chalk');
const path = require('path');

const package = require(path.join(__dirname, '..', 'package.json'));
const description = docs.kakle();

program
  .version(package.version)
  .usage('[options] <sub-task>')
  .description(description)
  .command('hooks <command>', 'activate, deactivate or show current status of git hooks in a repo')
  .command('exec <manifest>', 'execute kakle on manifestfile (mostly used by hooks)')
  .command('add [hook-type]', 'Add tags, regexes and/or globs')
  .command('remove [hook-type]', 'Remove tags, regexes and/or globs')
  .command('list [hook-type]', 'List different tags, regexes and/or globs', {isDefault: true})
  .parse(process.argv);
