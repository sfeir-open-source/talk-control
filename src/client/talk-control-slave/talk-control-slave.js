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
        this._captureMouseEvent = this._captureMouseEvent.bind(this);
        this._touchPosition = {
            touchstart: { clientX: 0, clientY: 0 },
            touchend: { clientX: 0, clientY: 0 }
        };
    }

    init() {
        this.engine.init();
        // Send the total slide number
        const slides = this.engine.getSlides();
        // Emit the initialized event only on the 'main' slave
        if (!this.delta) this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'initialized', { slides });
        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'gotoSlide', data => {
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', this.engine.getSlideNotes());
            }
        });
        // Capture all keyboards events and only let go the ones that are not interpreted by us
        addEventListener('touchstart', this._captureMouseEvent, false);
        addEventListener('touchend', e => this._captureMouseEvent(e, true), false);

        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'registerPlugin', ({plugin})=> {
            plugin.onEvent((type, event)=>this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, type, event));
        });
   }
   


    _captureMouseEvent(event, forward = false) {
        this._touchPosition[event.type] = {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY
        };

        if (forward) {
            this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'touchEvent', { position: this._touchPosition });
        }
    }
}
