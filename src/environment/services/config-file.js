'use strict';

const fs = require('fs');

const configFilePath = __dirname + '/../../../config/config.json';

/**
 * Update service item with external url in config file
 *
 * @param {string} item - service item in config (tc-server, tc-controller, ...)
 * @param {string} url - url external to write in config for service item
 */
exports.setExternalUrl = (item, url) => {
    const config = require(configFilePath);
    config[item].urls.external = url;
    writeNewConfig(config);
};

/**
 * Write config file with new config object
 *
 * @param {*} config - config object
 */
const writeNewConfig = config => {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 4));
};
