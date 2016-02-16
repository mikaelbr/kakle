const program = require('commander');
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

if (typeof type !== 'undefined' &&
  allowedTypes.indexOf(type) === -1) {
  console.error(
    'Type', type, 'not valid.',
    'Try one of ' + allowedTypes.join(', ')
  );
  process.exit(1);
}

hooks.list(type, function (err, data) {
  if (err) {
    console.error(err.message);
    return process.exit(1);
  }
  print.list(data);
});
