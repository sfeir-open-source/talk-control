import { EventBusComponent } from '@event-bus/event-bus-component';

export class TimerTCComponent extends EventBusComponent {
    constructor(timer) {
        super();
        this.timer = timer;
    }

    init() {
        this.timer.reset();
    }
}
