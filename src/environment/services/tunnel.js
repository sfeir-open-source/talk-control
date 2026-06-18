import config from '../../../config/config.json';
import ngrok from 'ngrok';

/**
 * Create a tunnel to specified local port and return an url
 *
 * @param {number} port - local port on which to redirect
 * @returns {string} External url
 */
export const getUrl = async port => {
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

export default { getUrl };
