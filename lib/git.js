const exec = require('child_process').exec;
const latestFiles = 'git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD';
const latestCommits = 'git --no-pager log --pretty="tformat:%B%n[...]%n" ORIG_HEAD..';

var getFiles = module.exports.changedFiles = function (cwd, cb) {
  exec(latestFiles, { cwd: cwd }, function (err, data) {
    if (err) return cb(err);
    var files = filterAndTrim(
      (data || '').split('\n')
    );
    cb(null, files);
  });
};

var getCommits = module.exports.latestCommits = function (cwd, cb) {
  exec(latestCommits, { cwd: cwd }, function (err, data) {
    if (err) return cb(err);
    var commits = filterAndTrim(
      (data || '').split('\n[...]\n')
    );
    cb(null, commits);
  });
};

module.exports.get = function (cwd, cb) {
  getFiles(cwd, function (err, files) {
    if (err) {
      return cb(err);
    }
    getCommits(cwd, function (err, commits) {
      if (err) {
        return cb(err);
      }
      cb(void 0, {
        files: files,
        commits: commits
      });
    });
  });
};

function filterAndTrim (list) {
  return list
    .map(function (t) { return t.trim(); })
    .filter(function (t) { return !!t; });
}
