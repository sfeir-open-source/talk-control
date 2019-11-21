'use strict';

import { EventBusResolver, SECONDARY_CHANNEL } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';

export class TalkControlSlave {
    constructor(params) {
        this.eventBus = new EventBusResolver({
            postMessage: {
                slave: true
            }
        });
        this.engine = EngineResolver.getEngine(params.engineName);
        this.eventBus.on(SECONDARY_CHANNEL, 'init', this.init.bind(this));
    }

    init() {
        // Send the total slide number
        const slides = this.engine.getSlides();
        this.eventBus.emit(SECONDARY_CHANNEL, 'initialized', { slides });
        this.eventBus.on(SECONDARY_CHANNEL, 'gotoSlide', data => this.engine.goToSlide(data.slide));
    }
}
