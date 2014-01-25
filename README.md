require-local
=============

Require-local is a wrapper for require() that allows referencing dependencies from the root of the local application
(or a sub-directory) instead of forcing the use of relative paths.

Though this is a somewhat controversial topic, I think that a reasonable argument can be made that relative pathing
for require() calls to modules local to an application, especially a large-scale app, can present a significant
maintenance burden and deter agressive refactoring.  No one wants to edit hundreds of "../../" strings over dozens of
files just because they've decided to restructure their directory structure slightly.  The argument to be made here is
that Node supports a non-relative pathing approach for third-party modules (in the form of "node_modules" being in the
require() search-path.  The common response to this argument is "package it up and put it in your dependencies" but I
think this approach falls short.  Frequently, modules are application-specific logic and would be meaningless outside of
the context of the application they were written for.  Packaging something for reuse that will never be reused is the
epitome of over-engineering and a clear rejection of "do the simplest thing that will work".

Anyway, many people will argue that the require-local approach is bad practice.  I'm not going to convince those people
that it's not (nor am I trying), but for those of you who think this is an oversight in Node, require-local provides a
fairly elegant (and ridiculously simple) implementation.  The entire package is well under 10k, consists of maybe 20
lines of code, and has no external dependencies.

So enough with the arm-twisting.  How does it work?

Quick Examples
==============

```javascript
var require_local = require('require-local');
var myModule = require_local('modules/myModule');
```

Where "myModule" is a module in the /modules directory of the application.  For example:
  `//path/to/my/app/modules/myModule.js`

You use the same code, regardless of where the source file lives in the directory structure of the application.  No need
for "../../modules/myModule".

### .root() ###

You can also chose to "pin" require-local to a sub-directory in your app using .root(), in which case require-local will
use specified sub-directory as the root directory for the require() path.  So our above example would look like this:

```javascript
var require_local = require('require-local').root('modules');
var myModule = require_local('myModule');
```

Require local can only be pinned to one directory so changing this changes it for everyone (the root path is held in a
closure for the function).  This means that nothing in your app will be able to pin to a different root directory or
use require-local at the application's root path.

### .globalize() ###

You can also choose to attached require_local to the global object in Node.  I realize that this is another practice
that some would take issue with under the mantra of "global variables are bad" but it provides essentially identical
behavior to Node's require() (although require is actually local to the module so it's not really quite the same) and
is entirely optional.  You don't have to use this facet of require-local and it doesn't behave this way by default.

To enable this functionality simply call .globalize() when you require the require-local module.  This should be done
near the beginning of your main module and there's no need to assign the result to a variable because it will now be
attached to global.require_local.

```javascript
require('require-local').globalize();
var myModule = require_local('modules/myModule');
```

Note that once you do this every module you load will have access to require_local so anyone can call it without having
to first require the require-local module.  There's no harm in having sub-modules also call
`require('require-local').globalize();` - if it's already there it doesn't do anything.

You can also supply .globalize() with an alternate name to use instead of `require_local`.  For example:

```javascript
require('require-local').globalize('require$');
var myModule = require$('modules/myModule');
```

Note that you can only do this once and it can't later be changed.  If you try you'll get an error thrown with the
message `'You cannot re-globalize require-local with a different name.'`

An important note about the app root
====================================

Note that require-local uses the path to require.main.filename as the root of the application, so the assumption here
is that the main module is in the root of your application.  If you're running as the main a module who's file lives
in a sub-directory in your app then everything will be relative to that that directory, NOT the app's root directory.

Unit Tests
==========

There are a handful of unit tests (implemented using nodeunit).  There's a built-in test runner so to run the unit tests
just execute `node test` from the root of the package.

Nodelint
==========

Require-local.js should be nodelint compliant.  To verify run `node ./node_modules/nodelint/nodelint require-local.js`