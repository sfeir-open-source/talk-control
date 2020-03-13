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
    Use TalkControl from localhost:`
);
console.log(`    Get started by opening url: ${config.tcMaster.urls.local}`.green);
console.log(
    `
    Use TalkControl remotely:`
);
if (config.tcMaster.urls.external) {
    console.log(`    Get started by opening url: ${config.tcMaster.urls.external}`.green);
} else {
    console.log(
        `    TalkControl use ngrok to be accessible remotely:
        1. Create an account and login on https://ngrok.com/
        2. Get your auth token on page https://dashboard.ngrok.com/auth
        3. Add your auth token to file: config/config.json
        4. Quit and restart TalkControl with npm start`.cyan
    );
}
console.log('\n'.bgBrightBlue);
console.log('\n');
