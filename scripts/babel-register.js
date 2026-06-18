'use strict';
// @babel/node@8 bin is broken on Node 24 (ESM import without .js extension).
// This script reproduces exactly what babel-node did: set up @babel/register
// with an empty ignore list so babel.config.js controls what gets transpiled.
// Specifically needed for query-selector-shadow-dom (ES6-only, shared server/client code).
// @babel/register v8 exports via .default (ESM interop via __esModule).
require('@babel/register').default({ ignore: [] });
