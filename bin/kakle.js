#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const package = require(path.join(__dirname, '..', 'package.json'));

program
  .version(package.version)
  .command('hooks <command>', 'activate or deactivate git hooks in a repo')
  .command('exec <manifest>', 'execute kakle on manifestfile (mostly used by hooks)')
  .command('add [type]', 'Add tags, regexes and/or globs')
  .command('remove [type]', 'Remove tags, regexes and/or globs')
  .command('list [type]', 'List different tags, regexes and/or globs', {isDefault: true})
  .parse(process.argv);
