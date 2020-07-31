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
        this.eventBusServer.onMultiple(MASTER_SERVER_CHANNEL, 'init', this.engine.init);
        this.eventBusServer.onMultiple(MASTER_SERVER_CHANNEL, 'inputEvent', this.engine.handleInput);
        
        this.eventBusServer.onMultiple(MASTER_SERVER_CHANNEL, 'pluginEventIn', data /* { subType: 'pointerEvent', data }*/ => this.eventBusServer.emit(MASTER_SERVER_CHANNEL, 'pluginEventOut', data));
        this.eventBusServer.onMultiple(MASTER_SERVER_CHANNEL, 'sendPointerEventToMaster', data => this.eventBusServer.emit(MASTER_SERVER_CHANNEL, 'pointerEvent', data));
        this.eventBusServer.onMultiple(MASTER_SERVER_CHANNEL, 'getPluginsToActivate', socket => {
            const fs = require('fs');
            const path = require('path');
            let plugins = [];
            try {
                plugins = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugins.json')).toString('utf8'));
                this.eventBusServer.emitNotBroadcast(MASTER_SERVER_CHANNEL, 'activatePlugins', plugins, socket);
            } catch (e) {
                // ...
            }
        });
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
