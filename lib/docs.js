const TerminalRenderer = require('marked-terminal');
const marked = require('marked');
const path = require('path');
const fs = require('fs');

marked.setOptions({
  renderer: new TerminalRenderer({
    reflowText: true
  }),
});

[
  'kakle', 'add', 'exec', 'hooks', 'list', 'remove'
].forEach(function (api) {
  module.exports[api] = getDocs.bind(null, api);
});

function getDocs (filename) {
  var file = path.join(__dirname, '..', 'docs', filename + '.md');
  var content = fs.readFileSync(file).toString('utf-8');
  content = marked(content);
  return content.split('\n').map(function (line, i) {
    if (i === 0) return line;
    return '  ' + line;
  }).join('\n');
}
