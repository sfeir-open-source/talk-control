'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { EventBusComponent } from '@event-bus/event-bus-component';

export class TouchPointerMaskTCComponent extends EventBusComponent {
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData) {
        this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginEventIn', eventData);
    }
}
