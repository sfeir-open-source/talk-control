'use strict';

import { EventBusResolver, CONTROLLER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import store from './store';
import { EngineResolver } from './engines/engine-resolver';

/**
 * @classdesc Handle state changes and socket events
 * @class TCServer
 */
export class TCServer {
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
        this.eventBusServer.onMultiple(CONTROLLER_SERVER_CHANNEL, 'init', this.engine.init);
        this.eventBusServer.onMultiple(CONTROLLER_SERVER_CHANNEL, 'inputEvent', this.engine.handleInput);
        this.eventBusServer.onMultiple(CONTROLLER_SERVER_CHANNEL, 'pluginStartingIn', data => this.eventBusServer.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginStartingOut', data));
        this.eventBusServer.onMultiple(CONTROLLER_SERVER_CHANNEL, 'pluginEndingIn', data => this.eventBusServer.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginEndingOut', data));
        this.eventBusServer.onMultiple(CONTROLLER_SERVER_CHANNEL, 'pluginEventIn', data => this.eventBusServer.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginEventOut', data));
        this.eventBusServer.onMultiple(CONTROLLER_SERVER_CHANNEL, 'getPlugins', socket => {
            const fs = require('fs');
            const path = require('path');
            let plugins = [];
            try {
                plugins = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugins.json')).toString('utf8'));
                this.eventBusServer.emitTo(CONTROLLER_SERVER_CHANNEL, 'pluginsList', plugins, socket);
            } catch (e) {
                // ...
            }
        });
        store.subscribe(this.broadcastStateChanges.bind(this));
    }

    /**
     * Broadcast an event depending on state changes
     */
    broadcastStateChanges() {
        const currentState = store.getState();
        this.eventBusServer.broadcast(CONTROLLER_SERVER_CHANNEL, 'gotoSlide', { slide: currentState.currentSlide });
        this.previousState = currentState;
    }
}
