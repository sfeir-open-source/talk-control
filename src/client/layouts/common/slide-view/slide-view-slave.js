'use strict';

import { MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

export class SlideViewSlave extends TalkControlSlave {
    init() {
        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'pointerEvent', postMessage);
    }
}
