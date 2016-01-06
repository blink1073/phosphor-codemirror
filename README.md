phosphor-codemirror
=================

[![Build Status](https://travis-ci.org/phosphorjs/phosphor-codemirror.svg)](https://travis-ci.org/phosphorjs/phosphor-codemirror?branch=master)
[![Coverage Status](https://coveralls.io/repos/phosphorjs/phosphor-codemirror/badge.svg?branch=master&service=github)](https://coveralls.io/github/phosphorjs/phosphor-codemirror?branch=master)

A Phosphor widget which wraps a CodeMirror editor.

[API Docs](http://phosphorjs.github.io/phosphor-codemirror/api/)


Package Install
---------------

**Prerequisites**
- [node](http://nodejs.org/)

```bash
npm install --save phosphor-codemirror
```


Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)

```bash
git clone https://github.com/phosphorjs/phosphor-codemirror.git
cd phosphor-codemirror
npm install
```

**Rebuild**
```bash
npm run clean
npm run build
```


Run Tests
---------

Follow the source build instructions first.

```bash
# run tests in Firefox
npm test

# run tests in Chrome
npm run test:chrome

# run tests in IE
npm run test:ie
```


Build Docs
----------

Follow the source build instructions first.

```bash
npm run docs
```

Navigate to `docs/index.html`.


Build Example
-------------

Follow the source build instructions first.

```bash
npm run build:example
```

Navigate to `example/index.html`.


Supported Runtimes
------------------

The runtime versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- IE 11+
- Firefox 32+
- Chrome 38+


Bundle for the Browser
----------------------

Follow the package install instructions first.

Any bundler that understands how to `require()` files with `.js` and `.css`
extensions can be used with this package.


Usage Examples
--------------

**Note:** This module is fully compatible with Node/Babel/ES6/ES5. Simply
omit the type declarations when using a language other than TypeScript.
