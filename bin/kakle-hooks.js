const program = require('commander');
const hooks = require('../lib/hooks');

const allowedCommands = [
  'activate',
  'reactivate',
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
   console.error('no command given!');
   process.exit(1);
}

if (inputCommand === 'status') {
  hooks.has(showStatus);
} else if (inputCommand === 'reactivate') {
  hooks.deactivate(function (err, data) {
    if (err) {
      console.error('Could not reactivate:', err.message);
      return process.exit(1);
    }

    hooks.activate(function (err, data) {
      if (err) {
        console.error('Could not reactivate:', err.message);
        return process.exit(1);
      }

      console.log('Force reactivated hooks for repo');
    });
  });
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
    console.error(err);
    return process.exit(1);
  }

  console.log(data);
  process.exit(0);
}

function showStatus (exists) {
  if (exists) {
    console.log('Hooks existing and activated.');
  } else {
    console.log('Hooks not yet activated.');
    console.log('Run `kakle hooks activate` to activate hooks.');
  }

  process.exit(0);
}
