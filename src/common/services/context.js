import config from '@config/config.json';

/**
 * Return true if windowLocationHref is presentation's iframe
 *
 * @param {string} windowLocationHref - href string to test
 * @returns {boolean} true if windowLocationHref is presentation's iframe
 */
export const isPresentationIframe = windowLocationHref => {
    if (!windowLocationHref) {
        return false;
    }

    return windowLocationHref.indexOf(`:${config.tcController.port}`) === -1;
};

/**
 * Return true if windowLocationHref is a remote url
 *
 * @param {string} windowLocationHref - href string to test
 * @returns {boolean} true if windowLocationHref is a remote url
 */
export const isUsingRemoteUrl = windowLocationHref => {
    if (!windowLocationHref) {
        return false;
    }

    return windowLocationHref.indexOf('://localhost:') === -1
};
