const program = require('commander');
const path = require('path');
const git = require('../lib/git');
const hooks = require('../lib/manifest-file');
const exec = require('../lib/exec');

var manifestFile;

program
  .arguments('<manifest>')
  .action(function (manifest) {
    if (!manifest) {
      console.error('No manifest file passed as input');
      return process.exit(1);
    }
    manifestFile = manifest;
  })
  .parse(process.argv);

exec(manifestFile, function (err, data) {
  if (err) {
    console.error(err.message);
    return process.exit(1);
  }
  data.forEach(function (str) {
    console.log(str.join('\n'));
  });
});
