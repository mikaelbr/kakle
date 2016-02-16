#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const package = require(path.join(__dirname, '..', 'package.json'));

var proc = program
  .version(package.version)
  .command('hooks <command>', 'manage git hooks')
  .command('exec <manifest>', 'execute kakle on manifestfile')
  .command('add [type]', 'Add tags, regexes and/or globs')
  .command('remove [type]', 'Add tags, regexes and/or globs')
  .command('list [type]', 'List different hooks')
  .parse(process.argv);
