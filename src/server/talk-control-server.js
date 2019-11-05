'use strict';

import { EventBusResolver } from '@event-bus/event-bus-resolver';
import store from './store';
import { movement, init } from './store/actions';

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
    }

    /**
     * Subscribe to socket and store events
     */
    init() {
        this.eventBus.socketBus.on('init', data => store.dispatch(init(data)));
        this.eventBus.socketBus.on('movement', data => store.dispatch(movement(data)));
        store.subscribe(this.emitStateChanges.bind(this));
    }

    /**
     * Emit an event depending on state changes
     */
    emitStateChanges() {
        const currentState = store.getState();
        switch (true) {
            case this.previousState.slideNumber !== currentState.slideNumber:
                this.eventBus.socketBus.emit('slideNumber', currentState);
                break;
            case currentState.currentSlide !== this.previousState.currentSlide:
                this.eventBus.socketBus.emit('currentSlide', currentState.currentSlide);
                break;
        }
        this.previousState = currentState;
    }
}
