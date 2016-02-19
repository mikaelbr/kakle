const fs = require('fs');
const rc = require('./rc');
const path = require('path');
const rcFile = rc.config;

module.exports.addTag = addAndValidate.bind(null, 'tag');
module.exports.addRegex = addAndValidate.bind(null, 'regex');
module.exports.addGlob = addAndValidate.bind(null, 'glob');
module.exports.add = function (item, cb) {
  return addAndValidate(getType(item), item, cb);
};

module.exports.removeIndex = removeIndex;
module.exports.removeTag = removeItem.bind(null, 'tag');
module.exports.removeRegex = removeItem.bind(null, 'regex');
module.exports.removeGlob = removeItem.bind(null, 'glob');
module.exports.remove = function (type, name, cb) {
  return removeItem(type, name, cb);
};

module.exports.get = getItem;
module.exports.list = function list (type, cb) {
  if (typeof type === 'function') {
    cb = type;
    type = void 0;
  }
  getContent(function (err, content) {
    if (err) return cb(err);
    var data = (content.hooks || []);
    if (!type) return cb(null, data);
    return cb(null, data.filter(function (item) {
      if (type === 'tag' && !!item.tag) {
        return true;
      }
      if (type === 'regex' && !!item.regex) {
        return true;
      }
      if (type === 'glob' && !!item.glob) {
        return true;
      }
      return false;
    }));
  });
};

function addAndValidate (field, data, cb) {
  data = cloneAndDefault(data);
  var invalidMessage = isInvalid(field, data);
  if (invalidMessage) return cb(new Error(invalidMessage));
  addNewItem(data, cb);
}

function cloneAndDefault (data) {
  return Object.assign({}, data, {
    autorun: !!(data || {}).autorun
  });
}

function getType (item) {
  if (item.regex) {
    return 'regex';
  }
  if (item.glob) {
    return 'glob';
  }
  return 'tag';
}

function addNewItem (item, cb) {
  getContent(function (err, content, json) {
    if (err) return cb(err);

    var hooks = content.hooks || [];
    hooks = hooks.concat([
      item
    ]);

    content.hooks = hooks;
    saveContent(content, json, cb);
  });
}

function removeIndex (index, cb) {
  getContent(function (err, content, json) {
    if (err) return cb(err);
    content.hooks = (content.hooks || []).filter(function (item, itemIndex) {
      return itemIndex !== index;
    });
    saveContent(content, json, cb);
  });
}

function removeItem (field, name, cb) {
  getContent(function (err, content, json) {
    if (err) return cb(err);
    content.hooks = (content.hooks || []).filter(function (item) {
      if (field === 'tag' && item.tag === name) {
        return false;
      }
      if (field === 'regex' && item.regex === name) {
        return false;
      }
      if (field === 'glob' && item.glob === name) {
        return false;
      }
      return true;
    });
    saveContent(content, json, cb);
  });
}

function getItem (field, name, cb) {
  getContent(function (err, content) {
    if (err) return cb(err);
    var data = (content.hooks || []).filter(function (item) {
      if (field === 'tag' && item.tag === name) {
        return true;
      }
      if (field === 'regex' && item.regex === name) {
        return true;
      }
      if (field === 'glob' && item.glob === name) {
        return true;
      }
      return false;
    });
    cb(null, data);
  });
}

function getContent (cb) {
  fs.readFile(rcFile, function (err, json) {
    json = json.toString('utf-8');
    if (err) return cb(err);
    try {
      var content = JSON.parse(json);
      cb(null, content, json);
    } catch (e) {
      cb(e);
    }
  });
}

function saveContent (content, json, cb) {
  var str;
  try {
    str = new Buffer(JSON.stringify(
      content, null,
      space(json)) + getLastChar(json));
  } catch (e) {
    return cb(e);
  }
  fs.writeFile(rcFile, str, cb);
}

function isInvalid (field, options) {
  var messages = [];
  if (!options[field]) {
    messages.push(field + ' is required input.');
  }
  if (!options.command) {
    messages.push('Command is required input.');
  }
  if (!messages.length) {
    return false;
  }
  return messages.join('\n');
}

// Preserver new line at the end of a file
function getLastChar (json) {
  return (json.slice(-1) === '\n') ? '\n' : '';
}

// Figured out which "space" params to be used for JSON.stringfiy.
function space (json) {
  var match = json.match(/^(?:(\t+)|( +))"/m);
  return match ? (match[1] ? '\t' : match[2].length) : ''
}
