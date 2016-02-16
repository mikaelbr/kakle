const fs = require('fs');
const rc = require('./rc');
const path = require('path');

const base = path.dirname(rc.config)
const hooksDir = path.join(base, '.git', 'hooks');
const hookPath = path.join(hooksDir, 'post-merge');

const sourceHook = path.join(__dirname, '..', 'hooks', 'post-merge');

// TODO Support exsisting hooks
const has = module.exports.has = function (cb) {
  fs.stat(hookPath, function (err, stats) {
    if (err || !stats) return cb(false);
    return cb(stats.isFile());
  });
};

module.exports.activate = function (cb) {
  has(function (exists) {
    if (exists) {
      return cb(null, 'Already activated');
    }
    copyPasteFile(cb);
  });
};

module.exports.deactivate = function (cb) {
  has(function (exists) {
    if (!exists) {
      return cb(null, 'Already deactivated');
    }
    removeFile(cb);
  });
};

function copyPasteFile (cb) {
  fs.createReadStream(sourceHook)
    .pipe(fs.createWriteStream(hookPath))
    .on('finish', function (err, data) {
      if (err) return cb(err);
      fs.chmod(hookPath, '755', function (err, data) {
        if (err) return cb(err);
        cb(void 0, 'Activated hooks');
      });
    });
}

function removeFile (cb) {
  fs.unlink(hookPath, function (err) {
    if (err) return cb(err);
    cb(void 0, 'Deactivated hooks');
  });
}
