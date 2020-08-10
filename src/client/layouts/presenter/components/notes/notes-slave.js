'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class NotesSlave extends TalkControlSlave {
    init() {
        this.eventBusSlave.on(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToSlave', data => postMessage({ type: 'notesReceived', notes: data }));
    }
}
