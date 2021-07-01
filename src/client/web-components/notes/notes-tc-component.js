'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class NotesTCComponent extends EventBusComponent {
    constructor(notes) {
        super();
        this.notes = notes;
    }

    init() {
        this.controllerComponentChannel.on('sendNotesToComponent', data => this.notes.addNotes(data));
    }
}
