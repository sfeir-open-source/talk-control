'use strict';

import { EventBusResolver, CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';

/**
 * @class TCComponent
 */
export class EventBusComponent {
    constructor() {
        this.eventBusComponent = new EventBusResolver();
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'init', this.init.bind(this));
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'error', this.error.bind(this));
    }

    init() {
        throw new Error('Not implemented method');
    }

    error() {
        throw new Error('Not implemented method');
    }
}
