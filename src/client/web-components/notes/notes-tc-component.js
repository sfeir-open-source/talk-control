'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TCComponent } from '@client/tc-component/tc-component';

export class NotesTCComponent extends TCComponent {
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToComponent', data => postMessage({ type: 'notesReceived', notes: data }));
    }
}
