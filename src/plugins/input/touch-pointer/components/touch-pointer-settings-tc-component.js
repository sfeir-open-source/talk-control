'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class TouchPointerSettingsTCComponent extends EventBusComponent {
    init() {
        this.controllerComponentChannel.on('touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData) {
        this.controllerComponentChannel.broadcast('pluginEventIn', eventData);
    }
}
