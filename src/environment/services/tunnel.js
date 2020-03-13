'use strict';

const config = require('../../../config/config');
const ngrok = require('ngrok');

/**
 * Create a tunnel to specified local port and return an url
 *
 * @param {number} port - local port on which to redirect
 * @returns {string} External url
 */
exports.getUrl = async port => {
    if (!config.ngrok.authToken) {
        return '';
    }

    return await ngrok.connect({
        authtoken: config.ngrok.authToken,
        proto: 'http',
        addr: port,
        bind_tls: true
    });
};
