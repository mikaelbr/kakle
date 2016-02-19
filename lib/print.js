const chalk = require('chalk');

module.exports.list = function (list) {
  if (!list || !list.length) {
    return console.log(chalk.red('No hooks found'));
  }
  console.log('\n');
  list.forEach(function (item) {
    var type = getType(item);
    console.log(chalk.blue('» ' +type + ':', chalk.yellow(item[type])));
    console.log(chalk.blue('  command:', chalk.yellow(item['command'])));
    console.log(
      chalk.blue('  Will run automaticcaly:',
        chalk.yellow(item.autorun ? 'Yes' : 'No')));
    console.log('\n');
  });
};

module.exports.sprintList = function (list) {
  return list.map(function (item, i) {
    var message = '';
    var type = getType(item);
    message += (chalk.blue('» ' +type + ':', chalk.yellow(item[type])));
    message += (chalk.blue('  command:', chalk.yellow(item['command'])));
    message += (
      chalk.blue('  Will run automaticcaly:',
        chalk.yellow(item.autorun ? 'Yes' : 'No')));

    return {
      name: message,
      value: i
    };
  });
};


function getType (item) {
  if (item.regex) {
    return 'regex';
  }
  if (item.glob) {
    return 'glob';
  }
  return 'tag';
}
