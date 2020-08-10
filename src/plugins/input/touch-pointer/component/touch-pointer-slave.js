'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TCComponent } from '@client/tc-component/tc-component';

export class TouchPointerSlave extends TCComponent {
    init() {
        this.eventBusSlave.on(CONTROLLER_COMPONENT_CHANNEL, 'touchPointer', e => postMessage);
    }

    sendPointerEventToMaster(eventData) {
        this.eventBusSlave.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginEventIn', eventData);
    }
}
