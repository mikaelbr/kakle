const fs = require('fs');
const rc = require('./rc');
const path = require('path');
const sourceHook = path.join(__dirname, '..', 'hooks', 'hook');

const base = path.dirname(rc.config)
const hooksDir = path.join(base, '.git', 'hooks');

const destinationFile = path.join(hooksDir, 'kakle-script');
// For normal merge pulls
const postMerge = path.join(hooksDir, 'post-merge');
// For `git pull --rebase`
const preRebase = path.join(hooksDir, 'pre-rebase');

const kakleScript = 'sh $DIR/kakle-script';
const runKakle = '# Kakle hooks \n'
  + 'DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"\n'
  + kakleScript;

// TODO Support exsisting hooks
const has = module.exports.has = function (cb) {
  hasFileAndNotEmpty(destinationFile, function (exists) {
    if (!exists) return cb(false);
    hasHookInHook(postMerge, function (exists) {
      if (!exists) return cb(false);
      hasHookInHook(preRebase, function (exists) {
        cb(exists);
      });
    });
  });
};

module.exports.activate = function (cb) {
  has(function (allExists) {
    if (allExists) return cb(null, 'Activated');
    copyPasteFile(function (err, message) {
      if (err) return cb(err);
      createAndAppendToFile(postMerge, function (err, data) {
        if (err) return cb(err);
        createAndAppendToFile(preRebase, function (err, data) {
          if (err) return cb(err);
          return cb(null, message);
        });
      });
    });
  });
};

module.exports.deactivate = function (cb) {
  removeFile(cb);
};

function copyPasteFile (cb) {
  fs.createReadStream(sourceHook)
    .pipe(fs.createWriteStream(destinationFile))
    .on('finish', function (err, data) {
      if (err) return cb(err);
      fs.chmod(destinationFile, '755', function (err, data) {
        if (err) return cb(err);
        cb(void 0, 'Activated hooks');
      });
    });
}

function hasFile (file, cb) {
  fs.stat(file, function (err, stats) {
    if (err || !stats) return cb(false);
    return cb(stats.isFile());
  });
}

function hasFileAndNotEmpty (file, cb) {
  fs.readFile(file, function (err, data) {
    if (err) return cb(false);
    cb(data && data.toString('utf-8').length > 2);
  });
}

function createAndAppendToFile (file, cb) {
  hasHookInHook(file, function (exists) {
    if (exists) return cb(null, 'Already exists and has hook');
    addHookToFile(file, cb)
  });
}

function hasHookInHook (file, cb) {
  fs.readFile(file, function (err, data) {
    if (err) return cb(false);
    cb(data && data.toString('utf-8').indexOf(kakleScript) !== -1);
  });
}

function addHookToFile (file, cb) {
  var append = function append (err) {
    if (err) return cb(err);
    fs.appendFile(file, runKakle, function (err) {
      if (err) return cb(err);
      cb(null, 'Hook added to file ' + file);
    });
  };
  hasFile(file, function (exists) {
    if (exists) return append();
    createEmptyFile(file, append);
  });
}

function createEmptyFile (file, cb) {
  const stream = fs.createWriteStream(file)
    .on('finish', function (err, data) {
      if (err) return cb(err);
      fs.chmod(file, '755', function (err, data) {
        if (err) return cb(err);
        cb(void 0, 'Activated hooks');
      });
    });

  stream.write('');
  stream.end();
}

function removeFile (cb) {
  createEmptyFile(destinationFile, function (err) {
    if (err) return cb(err);
    cb(void 0, 'Deactivated hooks');
  });
}
