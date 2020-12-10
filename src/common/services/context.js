'use strict';

import config from '@config/config.json';

export default {
    /**
     * Return true if windowLocationHref is presentation's iframe
     *
     * @param {string} windowLocationHref - href string to test
     * @returns {boolean} true if windowLocationHref is presentation's iframe
     */
    isPresentationIframe(windowLocationHref) {
        if (!windowLocationHref) {
            return false;
        }

        return windowLocationHref.indexOf(`:${config.tcController.port}`) === -1;
    },

    /**
     * Return true if windowLocationHref is a remote url
     *
     * @param {string} windowLocationHref - href string to test
     * @returns {boolean} true if windowLocationHref is a remote url
     */
    isUsingRemoteUrl(windowLocationHref) {
        if (!windowLocationHref) {
            return false;
        }

        return !/(:\/\/localhost|:\/\/127.0.0.1)/.test(windowLocationHref);
    }
};
