'use strict';

import { EventBusResolver } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';

export class TalkControlSlave {
    constructor(params) {
        this.eventBus = new EventBusResolver({
            postMessage: {
                slave: true
            }
        });
        this.engine = EngineResolver.getEngine(params.engineName);
        this.eventBus.postMessageBus.on('init', this.init.bind(this));
    }

    init() {
        // Send the total slide number
        const slides = this.engine.getSlides();
        this.eventBus.postMessageBus.emit('initialized', { slides });
        this.eventBus.postMessageBus.on('gotoSlide', data => this.engine.goToSlide(data.slide));
    }
}
