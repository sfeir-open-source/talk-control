'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class TouchPointerMaskTCComponent extends EventBusComponent {
    init() {
        this.controllerComponentChannel.on('touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData) {
        this.controllerComponentChannel.broadcast('pluginEventIn', eventData);
    }
}
