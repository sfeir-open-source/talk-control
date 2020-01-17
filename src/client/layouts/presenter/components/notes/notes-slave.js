'use strict';

import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class NotesSlave extends TalkControlSlave {
    init() {
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'sendNotesToSlave', data => postMessage({ type: 'notesReceived', notes: data }));
    }
}
