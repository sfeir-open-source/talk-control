'use strict';
// Launcher: sets up @babel/register then requires the server entry point.
// Using node -r ./scripts/babel-register.js src/server/index.js does NOT work
// because @babel/register only hooks require(), not the main module loaded
// directly by Node. Requiring index.js explicitly ensures Babel transpiles it.
require('./babel-register.js');
require('../src/server/index.js');
