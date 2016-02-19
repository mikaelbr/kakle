const hooks = require('../lib/manifest-file');
const print = require('../lib/print');
const inquirer = require('inquirer');
const program = require('commander');
const prompt = require('cli-prompt');
const chalk = require('chalk');

const allowedTypes = ['tag', 'regex', 'glob'];
var type;

program
  .arguments('[type]')
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
  prompt.multi([
    {
      key: 'type',
      label: 'type (tag, regex or glob)',
      required: true,
      'default': 'tag',
      validate: validateType
    }
  ], askForItem);
}

function askForItem (val) {
  var itemType = val.type || type;
  var questions = [
    {
      key: itemType,
      label: itemType,
      required: true,
      validate: validateLength
    }
  ];

  prompt.multi(questions,
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

    prompt.multi([{
      key: 'ok',
      label: 'does this look good?',
      'default': 'yes',
      type: 'boolean'
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
    throw new Error(chalk.red('Should be more than 2 characters'));
  }
}

function validateType (val) {
  if (allowedTypes.indexOf(val) === -1) {
    throw new Error(chalk.red(
      '» Type not found (' + chalk.yellow(val) + '). Try one of ('
      + chalk.yellow(allowedTypes.join(', ')) + ')'));
  }
}
