const program = require('commander');
const prompt = require('cli-prompt');
const hooks = require('../lib/manifest-file');
const print = require('../lib/print');

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
    console.error(e.message);
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
      validate: function (val) {
        if (val.length < 3) {
          throw new Error('Should be more than 2 characters');
        }
      }
    }
  ];

  prompt.multi(questions,
      removeList.bind(null, itemType));
}

function removeList (itemType, item) {
  hooks.get(itemType, item[itemType], function (err, items) {
    if (err) {
      console.error(e.message);
      return process.exit(1);
    }

    if (!items || !items.length) {
      console.log('No hooks to remove');
      return process.exit(0);
    }

    console.log('\nRemove these items:');
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
      console.error(err.message);
      process.exit(1);
    } else {
      console.log('Removed items');
      process.exit(0);
    }
  });
}

function validateType (val) {
  if (allowedTypes.indexOf(val) === -1) {
    throw new Error('Type not found (' + val + '). Try one of '
      + allowedTypes.join(', '));
  }
}
