const git = require('./git');
const path = require('path');
const chalk = require('chalk');
const parallel = require('run-parallel');
const minimatch = require('minimatch');
const hooks = require('./manifest-file');
const exec = require('child_process').exec;

module.exports = function (manifestFile, cb) {
  const dirname = path.dirname(manifestFile);
  git.get(path.dirname(manifestFile), function (err, data) {
    if (err) return cb(err);
    getData(dirname, data, cb);
  });
};

function getData (cwd, gitData, cb) {
  hooks.list(function (err, hooks) {
    if (err) return cb(err);
    executeHooks(cwd, gitData, hooks, cb);
  });
}

function executeHooks (cwd, gitData, hooks, cb) {
  var run = function (hook) {
    if (!!hook.tag) {
      return function (done) {
        execTag(cwd, gitData, hook, done);
      }
    }
    if (!!hook.regex) {
      return function (done) {
        return execRegex(cwd, gitData, hook, done);
      }
    }
    if (!!hook.glob) {
      return function (done) {
        return execGlob(cwd, gitData, hook, done);
      }
    }
  };

  parallel([
    function (done) {
      parallel(hooks.filter(isAutorun).map(run), done);
    },
    function (done) {
      parallel(hooks.filter(not(isAutorun)).map(run), done);
    }
  ], cb);
}

function execTag (cwd, gitData, hook, done) {
  var hasTag = gitData.commits.some(function (msg) {
    return msg.indexOf('[' + hook.tag + ']') !== -1;
  });
  if (!hasTag) return done();
  execCommand(cwd, hook, done);
}

function execRegex (cwd, gitData, hook, done) {
  var regex = new RegExp(hook.regex);
  var match = function (str) { return regex.match(str); };
  var hasRegex = gitData.commits.some(match)
    || gitData.files.some(match);
  if (!hasRegex) return done();
  execCommand(cwd, hook, done);
}

function execGlob (cwd, gitData, hook, done) {
  var match = function (str) {
    if (Array.isArray(hook.glob)) {
      return hook.glob.some(function (pattern) {
        return minimatch(str, pattern);
      });
    }
    return minimatch(str, hook.glob);
  };
  var hasGlob = gitData.files.some(match);
  if (!hasGlob) return done();
  execCommand(cwd, hook, done);
}

function execCommand (cwd, hook, done) {
  var message = '';
  if (!hook.autorun) {
    console.log(chalk.blue('» You should run the following command,'));
    console.log(chalk.blue('  due to the recent changes you just merged:'));
    console.log(chalk.blue('> ' + chalk.yellow(hook.command) + '\n'));
    return done(void 0, '');
  }

  console.log(chalk.blue('» Running command:\n'));
  console.log(chalk.blue('> ' + chalk.yellow(hook.command) + '\n'));
  exec(hook.command, { cwd: cwd }, function (err, data) {
    if (err) {
      console.log(chalk.red('»» Error running:\n' + err));
      return done(void 0, '');
    }
    console.log(chalk.green('»» Result:\n' + data));
    return done(void 0, '');
  });
}

function isAutorun (hook) {
  return hook.autorun;
}

function not (fn) {
  return function () {
    return !fn.apply(null, arguments);
  };
}
