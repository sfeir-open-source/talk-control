'use strict';

import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class NotesSlave extends TalkControlSlave {
    constructor(params) {
        super(params);
    }

    init() {
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'sendNotesToSlave', data => {
            document.getElementById('notes').innerHTML = data;
        });
    }
}

window.addEventListener('DOMContentLoaded', function() {
    // TODO: retrieve engineName from configuration
    new NotesSlave({ engineName: 'revealjs' });
    // Give the focus back to parent each time it goes to the iframe
    document.addEventListener('click', () => {
        parent.focus();
    });
});
