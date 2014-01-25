var path = require('path');
var appRoot = path.dirname(require.main.filename);
var globalName, searchPath;

function require_local(module) {
  return require(path.join(searchPath, module));
}

function init() {
  if (searchPath === undefined || searchPath === '') {
    searchPath = appRoot;
  }
  return require_local;
}

function root(modulesRoot) {
  modulesRoot  = modulesRoot === undefined ? '' : modulesRoot;
  searchPath = path.join(appRoot, modulesRoot);
  return require_local;
}

function globalize(name) {
  if (name !== undefined && name !== '' && globalName !== undefined && globalName !== name) {
    throw 'You cannot re-globalize require-local with a different name.';
  }

  globalName = name === undefined || name === '' ? 'require_local' : name;
  if (global[globalName] === undefined) {
    global[globalName] = require_local;
  } else if (global[globalName] !== require_local) {
    throw 'Global object already has a member with the specified name.';
  }
  return require_local;
}

function deglobalize() {
  if (global[globalName] !== undefined) {
    delete global[globalName];
  }
  globalName = undefined;
  return require_local;
}

module.exports = init();
module.exports.root = root;
module.exports.globalize = globalize;
module.exports.deglobalize = deglobalize;
