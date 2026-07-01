import { EventBusComponent } from '@event-bus/event-bus-component';

interface TimerHost {
    reset(): void;
}

export class TimerTCComponent extends EventBusComponent {
    timer: TimerHost;

    constructor(timer: TimerHost) {
        super();
        this.timer = timer;
    }

    override init(): void {
        this.timer.reset();
    }
}
