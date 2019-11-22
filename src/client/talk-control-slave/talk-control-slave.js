'use strict';

import { EventBusResolver, MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';

export class TalkControlSlave {
    constructor(params) {
        this.eventBus = new EventBusResolver({
            postMessage: {
                slave: true
            }
        });
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName);
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'init', this.init.bind(this));
    }

    init() {
        this.engine.init();
        // If there's a delta, move the initial slide
        if (this.delta) this.engine.changeSlide(this.delta);
        // Send the total slide number
        const slides = this.engine.getSlides();
        this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'initialized', { slides });
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'gotoSlide', data => {
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', this.engine.getSlideNotes());
            }
        });
    }
}
