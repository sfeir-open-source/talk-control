'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class TouchPointerMaskTCComponent extends EventBusComponent {
    init() {
        this.channel.on('touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData) {
        this.channel.broadcast('pluginEventIn', eventData);
    }
}
