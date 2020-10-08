'use strict';

/**
 * This line must be present *before* any import.
 * It is needed by wepback for a dynamic publicPath, that is
 * the hostname serving the tc-component.bundle.js
 * and other associated split chunks
 */
// eslint-disable-next-line no-undef
__webpack_public_path__ = window.tcResourcePath;

import { TCComponent } from './tc-component';

window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash || '#delta=0';
    const params = parseParams(hash);
    // TODO: retrieve engineName from configuration
    new TCComponent({ engineName: 'revealjs', ...params });
});

const parseParams = hash => {
    const paramsTab = hash.replace('#', '').split('&');
    const params = {};
    for (const paramStr of paramsTab) {
        let [key, value] = paramStr.split('=');
        if (Array.isArray(value)) {
            console.warn(`value given for key ${key} are badly formated`, value);
            value = value[0];
        }
        switch (true) {
            case !value:
                value = true;
                break;
            case !isNaN(value):
                value = parseInt(value);
                break;
        }
        params[key] = value;
    }
    return params;
};
