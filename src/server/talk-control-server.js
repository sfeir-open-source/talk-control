'use strict';

import { EventBusResolver, MASTER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import store from './store';
import { EngineResolver } from './engines/engine-resolver';

/**
 * @classdesc Handle state changes and socket events
 * @class TalkControlServer
 */
export class TalkControlServer {
    /**
     * @param {*} server - Server to connect to
     */
    constructor(server) {
        this.eventBusServer = new EventBusResolver({ server });
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
        this.eventBusServer.on(MASTER_SERVER_CHANNEL, 'init', this.engine.init);
        this.eventBusServer.on(MASTER_SERVER_CHANNEL, 'keyboardEvent', this.engine.handleInput);
        this.eventBusServer.on(MASTER_SERVER_CHANNEL, 'touchEvent', this.engine.handleTouch);
        this.eventBusServer.on(MASTER_SERVER_CHANNEL, 'sendPointerPositionToMaster', data => this.eventBusServer.emit(MASTER_SERVER_CHANNEL, 'pointerPosition', data));
        store.subscribe(this.emitStateChanges.bind(this));
    }

    /**
     * Emit an event depending on state changes
     */
    emitStateChanges() {
        const currentState = store.getState();
        this.eventBusServer.emit(MASTER_SERVER_CHANNEL, 'gotoSlide', { slide: currentState.currentSlide });
        this.previousState = currentState;
    }
}
