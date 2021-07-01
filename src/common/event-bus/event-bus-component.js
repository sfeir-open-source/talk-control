'use strict';

import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';

/**
 * @class TCComponent
 */
export class EventBusComponent {
    constructor() {
        this.controllerComponentChannel = EventBusResolver.channel(Channels.CONTROLLER_COMPONENT);
        this.controllerComponentChannel.on('init', this.init.bind(this));
        this.controllerComponentChannel.on('error', this.error.bind(this));
    }

    init() {}
    error() {}
}
