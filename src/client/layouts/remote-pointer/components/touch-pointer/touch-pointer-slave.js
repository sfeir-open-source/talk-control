'use strict';

import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class TouchPointerSlave extends TalkControlSlave {
    init() {}

    sendPointerPositionToMaster(position) {
        this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'sendPointerPositionToMaster', position);
    }
}
