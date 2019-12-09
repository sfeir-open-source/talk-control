'use strict';

import { EventBusResolver, MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';
import config from '@config/config.json';

/**
 * @class TalkControlSlave
 */
export class TalkControlSlave {
    constructor(params = {}) {
        this.eventBusSlave = new EventBusResolver({
            postMessage: {
                slave: true
            }
        });
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName);
        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'init', this.init.bind(this));
        this._captureKeyboardEvent = this._captureKeyboardEvent.bind(this);
    }

    async init() {
        this.engine.init();
        // Send the total slide number
        const { slides, slideNumber } = await this.engine.getSlides();
        // Emit the initialized event only on the 'main' slave
        if (!this.delta) this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'initialized', { slides, slideNumber });
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'gotoSlide', async data => {
            console.log('MASTER_SLAVE gotoSlide');
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.engine.getSlideNotes(data.slide).then(notes => this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', notes));
            }
        });
        // Capture all keyboards events and only let go the ones that are not interpreted by us
        addEventListener('keyup', e => this._captureKeyboardEvent(e, true), true);
        addEventListener('keypressed', this._captureKeyboardEvent, true);
        addEventListener('keydown', this._captureKeyboardEvent, true);
    }

    _captureKeyboardEvent(event, forward = false) {
        const keys = config.tcSlave.keysBlocked;
        // Check if there's a focused element that could be using
        // the keyboard
        const activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
        if (this.engine.isActiveElementEditable() || activeElementIsInput) return;
        // Check if the pressed key should be interpreted
        if (keys.includes(event.code)) {
            event.stopPropagation();
            if (forward) {
                this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'keyboardEvent', { key: event.key, code: event.code });
            }
        }
    }
}
