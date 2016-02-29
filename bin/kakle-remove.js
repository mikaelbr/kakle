const hooks = require('../lib/manifest-file');
const print = require('../lib/print');
const inquirer = require('inquirer');
const program = require('commander');
const docs = require('../lib/docs');
const chalk = require('chalk');

const allowedTypes = ['tag', 'regex', 'glob'];
var type;

program._name = 'kakle remove'

program
  .description(docs.remove())
  .arguments('[' + allowedTypes.join('|')+ ']')
  .action(function (inputType) { type = inputType; })
  .parse(process.argv);

if (typeof type === 'undefined') {
  hooks.list(function (err, list) {
    if (err) return console.log(chalk.red(err.message));
    inquirer.prompt([{
      type: 'list',
      name: 'hook',
      message: 'What hook do you want to remove?',
      choices: print.sprintList(list)
    }], function( answers ) {
      removeIndex(answers.hook);
    });
  });
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
  inquirer.multi([
    {
      name: 'type',
      message: 'type (tag, regex or glob)',
      default: 'tag',
      validate: validateType
    }
  ], askForItem);
}

function askForItem (val) {
  var itemType = val.type || type;
  var questions = [
    {
      name: itemType,
      message: itemType,
      validate: validateLength
    }
  ];

  inquirer.prompt(questions,
      removeList.bind(null, itemType));
}

function removeList (itemType, item) {
  hooks.get(itemType, item[itemType], function (err, items) {
    if (err) {
      console.error(chalk.red(e.message));
      return process.exit(1);
    }

    if (!items || !items.length) {
      console.log(chalk.blue('No hooks to remove'));
      return process.exit(0);
    }

    console.log(chalk.blue('\nRemove these items:'));
    print.list(items);

    inquirer.prompt([{
      name: 'ok',
      message: 'does this look good?',
      default: true,
      type: 'confirm'
    }], remove.bind(null, itemType, item));
  });
}

function remove (itemType, item, confirm) {
  if (!confirm.ok) return;
  hooks.remove(itemType, item[itemType], function (err, data) {
    if (err) {
      console.error(chalk.red(err.message));
      process.exit(1);
    } else {
      console.log(chalk.green('Removed items'));
      process.exit(0);
    }
  });
}

function removeIndex (index) {
  hooks.removeIndex(index, function (err, data) {
    if (err) {
      console.error(chalk.red(err.message));
      process.exit(1);
    } else {
      console.log(chalk.green('Removed items'));
      process.exit(0);
    }
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
