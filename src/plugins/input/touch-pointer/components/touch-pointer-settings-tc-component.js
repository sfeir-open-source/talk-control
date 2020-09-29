'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TCComponent } from '@client/tc-component/tc-component';

export class TouchPointerSettingsTCComponent extends TCComponent {
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData) {
        this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginEventIn', eventData);
    }
}
