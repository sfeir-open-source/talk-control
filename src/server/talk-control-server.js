'use strict';

import { EventBusResolver } from '@event-bus/event-bus-resolver';
import store from './store';
import { EngineResolver } from './engines/engine-resolver';
import * as _ from 'lodash';

/**
 * @classdesc Handle state changes and socket events
 * @class
 */
export class TalkControlServer {
    /**
     * Class contructor
     *
     * @param {*} server - Server to connect to
     */
    constructor(server) {
        this.eventBus = new EventBusResolver({ server });
        this.previousState = store.getState();
        this.engine = null;
    }

    /**
     * Subscribe to socket and store events and initialize the engine
     *
     * @param {string} engineName - Name of the engine to use
     */
    init(engineName) {
        this.engine = EngineResolver.getEngine(engineName);
        this.eventBus.socketBus.on('init', this.engine.init);
        this.eventBus.socketBus.on('keyPressed', this.engine.handleInput);
        store.subscribe(this.emitStateChanges.bind(this));
    }

    /**
     * Emit an event depending on state changes
     */
    emitStateChanges() {
        const currentState = store.getState();
        switch (true) {
            case !this.previousState.slides.length && !!currentState.slides.length:
                this.eventBus.socketBus.emit('initialized');
                break;
            case !_.isEmpty(this.previousState.currentSlide) && !this.engine.slideEquals(currentState.currentSlide, this.previousState.currentSlide):
                this.eventBus.socketBus.emit('gotoSlide', { slide: currentState.currentSlide });
                break;
        }
        this.previousState = currentState;
    }
}
