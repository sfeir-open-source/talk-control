import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import type { EventBus } from '@event-bus/event-bus';

export class EventBusComponent {
    controllerComponentChannel: EventBus;

    constructor() {
        this.controllerComponentChannel = EventBusResolver.channel(Channels.CONTROLLER_COMPONENT);
        this.controllerComponentChannel.on('init', this.init.bind(this));
        this.controllerComponentChannel.on('error', this.error.bind(this));
    }

    init(): void {}
    error(): void {}
}
