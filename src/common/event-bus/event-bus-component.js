'use strict';

import { EventBusResolver, CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';

/**
 * @class TCComponent
 */
export class EventBusComponent {
    constructor() {
        this.eventBusComponent = new EventBusResolver({
            postMessage: {}
        });
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'init', this.init.bind(this));
    }

    init() {
        // Empty method that will be override
    }
}
