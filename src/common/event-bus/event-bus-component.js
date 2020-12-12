'use strict';

import { EventBusResolver, CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';

/**
 * @class TCComponent
 */
export class EventBusComponent {
    constructor() {
        this.channel = EventBusResolver.channel(CONTROLLER_COMPONENT_CHANNEL);
        this.channel.on('init', this.init.bind(this));
        this.channel.on('error', this.error.bind(this));
    }

    init() {}
    error() {}
}
