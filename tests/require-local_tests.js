exports.require_local_variable = function(test){
  test.expect(3);

  var require_local = require('../require-local');
  test.ok(require_local !== undefined, 'Local variable populated with require-local function.');

  var myModule = require_local('tests/modules/myModule');
  test.ok(myModule !== undefined, 'Call to require-local returns application module.');

  var working = myModule.myFunction('working');
  test.ok(working === 'working', 'Sanity check to make absolutely certain the module was properly loaded.');

  test.done();
};

exports.require_local_variable_pinned = function(test){
  test.expect(3);

  var require_local = require('../require-local').root('tests/modules');
  test.ok(require_local !== undefined, 'Local variable populated with require-local function.');

  var myModule = require_local('myModule');
  test.ok(myModule !== undefined, 'Call to require-local returns application module.');

  var working = myModule.myFunction('working');
  test.ok(working === 'working', 'Sanity check to make absolutely certain the module was properly loaded.');

  // NOTE: Clean up after ourselves. A little bit icky but this isn't straightforward to test.  -JF
  require('../require-local').root();

  test.done();
};

exports.require_local_globalize = function(test){
  test.expect(4);

  require('../require-local').globalize();
  test.ok(require_local !== undefined, 'Global variable populated with require-local function.');

  var myModule = require_local('tests/modules/myModule');
  test.ok(myModule !== undefined, 'Call to require-local returns application module.');

  var working = myModule.myFunction('working');
  test.ok(working === 'working', 'Sanity check to make absolutely certain the module was properly loaded.');

  // NOTE: Another icky, post-test cleanup.  -JF
  require('../require-local').deglobalize();
  test.ok(global.require_local === undefined, 'Verify that the global variable was removed.');

  test.done();
};

exports.require_local_globalize_custom_name = function(test){
  test.expect(4);

  require('../require-local').globalize('require$');

  test.ok(require$ !== undefined, 'Global variable populated with require$ function.');

  var myModule = require$('tests/modules/myModule');
  test.ok(myModule !== undefined, 'Call to require$ returns application module.');

  var working = myModule.myFunction('working');
  test.ok(working === 'working', 'Sanity check to make absolutely certain the module was properly loaded.');

  // NOTE: Still another icky, post-test cleanup.  -JF
  require('../require-local').deglobalize();
  test.ok(global.require$ === undefined, 'Verify that the global variable was removed.');

  test.done();
};

// TODO: How about some *failing* tests here?!  -JF