'use strict';
// @babel/register v8 uses a worker_thread for compilation and calls isFileIgnored()
// via IPC for EVERY require() — including ignored files. For each call it runs
// cloneDeep(transformOpts) + loadPartialConfigAsync in the worker, causing memory
// accumulation (GC can't keep up with thousands of allocs across startup).
//
// Fix: install a high-priority pirates hook AFTER @babel/register so it runs
// FIRST (pirates is LIFO). For regular node_modules it returns code unchanged,
// short-circuiting @babel/register's IPC entirely. Only source files and
// query-selector-shadow-dom (ES6-only, needs transpilation) reach the IPC.
const pirates = require('pirates');

require('@babel/register').default({
    ignore: [/node_modules\/(?!query-selector-shadow-dom)/]
});

// High-priority pass-through hook: intercept node_modules before @babel/register
// can call its worker IPC. Returns code unchanged — no Babel needed for these.
pirates.addHook(code => code, {
    exts: ['.js', '.mjs', '.cjs'],
    ignoreNodeModules: false,
    matcher: filename => /node_modules/.test(filename) && !/node_modules[/\\]query-selector-shadow-dom/.test(filename)
});
