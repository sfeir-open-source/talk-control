'use strict';

import { TalkControlSlave } from './talk-control-slave';

window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash || '#delta=0';
    const params = parseParams(hash);
    // TODO: retrieve engineName from configuration
    new TalkControlSlave({ engineName: 'spectaclejs', delta });
    // Give the focus back to parent each time it goes to the iframe
    document.addEventListener('click', () => {
        parent.focus();
    });
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
