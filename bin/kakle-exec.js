const hooks = require('../lib/manifest-file');
const program = require('commander');
const exec = require('../lib/exec');
const docs = require('../lib/docs');
const git = require('../lib/git');
const chalk = require('chalk');
const path = require('path');

var manifestFile;

program._name = 'kakle exec'

program
  .description(docs.exec())
  .arguments('<manifest-file>')
  .action(function (manifest) {
    if (!manifest) {
      console.error(chalk.red('No manifest file passed as input'));
      return process.exit(1);
    }
    manifestFile = manifest;
  })
  .parse(process.argv);

exec(manifestFile, function (err, data) {
  if (err) {
    console.error(chalk.red(err.message));
    return process.exit(1);
  }
  data.forEach(function (str) {
    console.log(chalk.blue(str.join('\n')));
  });
});
