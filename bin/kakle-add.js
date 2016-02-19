const hooks = require('../lib/manifest-file');
const inquirer = require('inquirer');
const program = require('commander');
const chalk = require('chalk');

const allowedTypes = ['tag', 'regex', 'glob'];
var type;

program
  .arguments('[type]')
  .action(function (inputType) {
    type = inputType;
  })
  .parse(process.argv);

if (typeof type === 'undefined') {
 promptType();
} else {
  try {
    validateType(type);
    askForItem(type);
  } catch (e) {
    console.error(chalk.red(e.message));
    promptType();
  }
}

function promptType () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'type',
      message: 'type (tag, regex or glob)',
      default: 'tag',
      validate: validateType
    }
  ], askForItem);
}

function askForItem (val) {
  var questions = [
    {
      type: 'input',
      name: val.type || type,
      message: val.type || type,
      default: 'install',
      validate: validateLength
    },

    {
      type: 'input',
      name: 'command',
      message: 'command',
      default: 'npm install',
      validate: validateLength
    },

    {
      type: 'confirm',
      name: 'autorun',
      message: 'should run automatically',
      default: true
    }
  ];

  inquirer.prompt(questions, function (item) {
    console.log('\n' + chalk.yellow(JSON.stringify(item, null, 2)) + '\n');
    inquirer.prompt([{
      type: 'confirm',
      name: 'ok',
      message: 'Does this look good?',
      default: true
    }], function (confirm) {
      if (!confirm.ok) return;
      hooks.add(item, function (err, data) {
        if (err) {
          console.error(err.message);
          process.exit(1);
        } else {
          console.log(chalk.green('√ Added new hook'));
          process.exit(0);
        }
      });
    });
  });
}

function validateLength (val) {
  if (val.length < 2) {
    return chalk.red('Should be more than 2 characters');
  }
  return true;
}

function validateType (val) {
  if (allowedTypes.indexOf(val) === -1) {
    return chalk.red(
      'Type not found (' + chalk.yellow(val) + '). Try one of ('
      + chalk.yellow(allowedTypes.join(', ')) + ')');
  }
  return true;
}
