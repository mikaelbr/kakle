const hooks = require('../lib/hooks');
const program = require('commander');
const chalk = require('chalk');
const allowedCommands = [
  'activate',
  'deactivate',
  'status'
];

var inputCommand;

program
  .arguments('<command>')
  .action(function (command) {
    inputCommand = command;
  })
  .parse(process.argv)

if (typeof inputCommand === 'undefined') {
   console.error(
      chalk.red(
        'No command given, try one of '
        + chalk.yellow(allowedCommands.join(', ')) + '!'
      )
   );
   process.exit(1);
}

if (inputCommand === 'status') {
  hooks.has(showStatus);
} else if (inputCommand === 'activate') {
  hooks.activate(handleActivateDeactivate);
} else if (inputCommand === 'deactivate') {
  hooks.deactivate(handleActivateDeactivate);
} else {
  console.error('Not allowed command: ' + inputCommand);
  console.error('Try one of ' + allowedCommands.join(', '));
  process.exit(1);
}

function handleActivateDeactivate (err, data) {
  if (err) {
    console.error(chalk.red(err.essage));
    return process.exit(1);
  }

  console.log(chalk.blue(data));
  process.exit(0);
}

function showStatus (exists) {
  if (exists) {
    console.log(chalk.blue('Hooks existing and activated.'));
  } else {
    console.log(chalk.blue('Hooks not yet activated.'));
    console.log(chalk.blue('Run '
      + chalk.yellow('`kakle hooks activate`')
      + ' to activate hooks.'));
  }

  process.exit(0);
}
