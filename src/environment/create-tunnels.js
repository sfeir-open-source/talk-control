'use strict';

const config = require('../../config/config.json');
const tunnelService = require('./services/tunnel');
const configFileService = require('./services/config-file');

/**
 * Create a tunnel for each service items in config (tc-server, tc-controller, tc-showcase)
 */
const setTunnels = async () => {
    const configItems = ['tcServer', 'tcController', 'tcShowcase'];

    for (const item of configItems) {
        try {
            const url = await tunnelService.getUrl(config[item].port);
            configFileService.setExternalUrl(item, url);
        } catch (e) {
            console.error(`Unable to set ${item} external url`, e);
        }
    }
};

setTunnels();
