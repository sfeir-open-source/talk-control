'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class TouchPointerSlave extends TalkControlSlave {
    init() {
        this.eventBusSlave.on(CONTROLLER_COMPONENT_CHANNEL, 'touchPointer', e => postMessage);
    }

    sendPointerEventToMaster(eventData) {
        this.eventBusSlave.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginEventIn', eventData);
    }
}
