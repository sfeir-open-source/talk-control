'use strict';

import { EventBusResolver, MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';
import config from '@config/config.json';

export class TalkControlSlave {
    constructor(params = {}) {
        this.eventBus = new EventBusResolver({
            postMessage: {
                slave: true
            }
        });
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName);
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'init', this.init.bind(this));
        this._captureKeyboardEvent = this._captureKeyboardEvent.bind(this);
    }

    init() {
        this.engine.init();
        // Send the total slide number
        const slides = this.engine.getSlides();
        // Emit the initialized event only on the 'main' slave
        if (!this.delta) this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'initialized', { slides });
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'gotoSlide', data => {
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', this.engine.getSlideNotes());
            }
        });
        // Capture all keyboards events and only let go the ones that are not interpreted by us
        addEventListener('keyup', e => this._captureKeyboardEvent(e, true), true);
        addEventListener('keypressed', this._captureKeyboardEvent, true);
        addEventListener('keydown', this._captureKeyboardEvent, true);
    }

    _captureKeyboardEvent(event, forward = false) {
        const keys = config.tcSlave.keysBlocked;
        if (keys.includes(event.code)) {
            event.stopPropagation();
            if (forward) this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'keyboardEvent', { key: event.key, code: event.code });
        }
    }
}
