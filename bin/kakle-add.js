const hooks = require('../lib/manifest-file');
const program = require('commander');
const prompt = require('cli-prompt');
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
  var questions = [
    {
      key: val.type || type,
      label: val.type || type,
      required: true,
      'default': 'install',
      validate: validateLength
    },

    {
      key: 'command',
      required: true,
      'default': 'npm install',
      validate: validateLength
    },

    {
      key: 'autorun',
      label: 'should run automatically',
      'default': 'yes',
      type: 'boolean'
    }
  ];

  prompt.multi(questions, function (item) {
    console.log('\n' + chalk.yellow(JSON.stringify(item, null, 2)) + '\n');
    prompt.multi([{
      key: 'ok',
      label: 'does this look good?',
      'default': 'yes',
      type: 'boolean'
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
