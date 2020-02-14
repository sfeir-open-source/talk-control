'use strict';

const localtunnel = require('localtunnel');

/**
 * Create a tunnel to specified local port and return an url
 *
 * @param {number} port - local port on which to redirect
 * @returns {string} External url
 */
exports.getUrl = async port => {
    const tunnel = await localtunnel({ port });
    return tunnel.url;
};
