
module.exports.list = function (list) {
  console.log('----');
  list.forEach(function (item) {
    var type = getType(item);
    console.log(type + ':', item[type]);
    console.log('command:', item['command']);
    console.log('Will run automaticcaly:', item.autorun ? 'Yes' : 'No');
    console.log('----');
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
