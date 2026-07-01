import { EventBusComponent } from '@event-bus/event-bus-component';

interface NotesHost {
    addNotes(data: unknown): void;
}

export class NotesTCComponent extends EventBusComponent {
    notes: NotesHost;

    constructor(notes: NotesHost) {
        super();
        this.notes = notes;
    }

    override init(): void {
        this.controllerComponentChannel.on('sendNotesToComponent', data => this.notes.addNotes(data));
    }
}
