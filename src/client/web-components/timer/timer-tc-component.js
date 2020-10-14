import { EventBusComponent } from '@event-bus/event-bus-component';

export class TimerTCComponent extends EventBusComponent {
    init() {
        postMessage({ type: 'initTimer' });
    }
}
