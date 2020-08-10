'use strict';

import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class TouchPointerSlave extends TalkControlSlave {
    init() {
        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'touchPointer', e => postMessage);
    }

    sendPointerEventToMaster(eventData) {
        this.eventBusSlave.broadcast(MASTER_SLAVE_CHANNEL, 'pluginEventIn', eventData);
    }
}
