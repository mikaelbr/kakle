const hooks = require('../lib/manifest-file');
const print = require('../lib/print');
const program = require('commander');
const chalk = require('chalk');

const allowedTypes = ['tag', 'regex', 'glob'];
var type;

program
  .arguments('[' + allowedTypes.join('|') + ']')
  .action(function (inputType) { type = inputType; })
  .parse(process.argv);

if (typeof type !== 'undefined' &&
  allowedTypes.indexOf(type) === -1) {
  console.error(chalk.red(
    '» Type not found (' + chalk.yellow(val) + '). Try one of ('
     + chalk.yellow(allowedTypes.join(', ')) + ')'
  ));
  process.exit(1);
}

hooks.list(type, function (err, data) {
  if (err) {
    console.error(chalk.red(err.message));
    return process.exit(1);
  }
  print.list(data);
});
