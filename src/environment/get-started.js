'use strict';

require('colors');
const config = require('../../config/config');

console.log('\n\n\tWelcome to TalkControl\n'.bgBrightBlue.bold);
console.log(
    `
    TalkControl MASTER is running on port ${config.tcMaster.port}
    TalkControl SERVER is running on port ${config.tcServer.port}
    SHOWCASE is served on port ${config.tcShowcase.port}`.gray
);
console.log(
    `
    Use TalkControl from localhost:
    Get started by opening url: ${config.tcMaster.urls.local}

    Use TalkControl remotely:
    Get started by opening url: ${config.tcMaster.urls.external}`.green
);
console.log('\n'.bgBrightBlue);
console.log('\n');
