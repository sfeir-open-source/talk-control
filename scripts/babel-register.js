'use strict';
// @babel/node@8 bin is broken on Node 24 (ESM import without .js extension).
// This script reproduces exactly what babel-node did: set up @babel/register
// with an empty ignore list so babel.config.js controls what gets transpiled.
// Specifically needed for query-selector-shadow-dom (ES6-only, shared server/client code).
// @babel/register v8 exports via .default (ESM interop via __esModule).
// Mirror the ignore rule from babel.config.js so the check happens at the
// @babel/register level (cheap) rather than after loading the full Babel
// config for every node_modules file (expensive / memory leak).
// query-selector-shadow-dom is an ES6-only module that must be transpiled
// even though it lives in node_modules.
require('@babel/register').default({
    ignore: [/node_modules\/(?!query-selector-shadow-dom)/]
});
