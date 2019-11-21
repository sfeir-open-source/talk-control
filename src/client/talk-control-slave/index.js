'use strict';

import { TalkControlSlave } from './talk-control-slave';

window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash || '#delta=0';
    const delta = Number(hash.trim('#').split('=')[1]);
    // TODO: retrieve engineName from configuration
    new TalkControlSlave({ engineName: 'revealjs', delta });
    // Give the focus back to parent each time it goes to the iframe
    document.addEventListener('click', () => {
        parent.focus();
    });
});
