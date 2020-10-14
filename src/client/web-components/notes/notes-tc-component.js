'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { EventBusComponent } from '@event-bus/event-bus-component';

export class NotesTCComponent extends EventBusComponent {
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToComponent', data => postMessage({ type: 'notesReceived', notes: data }));
    }
}
