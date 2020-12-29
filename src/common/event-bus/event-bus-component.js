'use strict';

import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';

/**
 * @class TCComponent
 */
export class EventBusComponent {
    constructor() {
        this.channel = EventBusResolver.channel(Channels.CONTROLLER_COMPONENT);
        this.channel.on('init', this.init.bind(this));
        this.channel.on('error', this.error.bind(this));
    }

    init() {}
    error() {}
}
