var path = require('path');
var appRoot = path.dirname(require.main.filename);
var globalName, searchPath;

function require_local(module) {
  searchPath = path.join( appRoot, module )
  return require( searchPath );
};

function init(){
  return require_local;
}

function root(modulesRoot){
  modulesRoot  = modulesRoot === undefined ? '' : modulesRoot;
  searchPath = path.join( appRoot, modulesRoot, module )
  return require_local;
}

function globalize(name){
  if(name !== undefined && name !== '' && globalName !== undefined && globalName !== name){
    throw 'You cannot re-globalize require-local with a different name.';
  }

  globalName = name === undefined || name === '' ? 'require_local' : name;
  if( global[globalName] === undefined ){
    global[globalName] = require_local;
  }else if(global[globalName] !== require_local){
    throw 'The Node.js global object already has a member with the name specified in require-local.globalize(name).';
  }
  return require_local;
}

function deglobalize(){
  if( global[globalName] !== undefined ){
    delete global[globalName];
  }
  return require_local;
}

module.exports = init();
module.exports.root = root;
module.exports.globalize = globalize;
module.exports.deglobalize = deglobalize;
