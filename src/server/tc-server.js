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
        this.channel = EventBusResolver.channel(CONTROLLER_SERVER_CHANNEL, { server });
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
        this.channel.onMultiple('init', this.engine.init);
        this.channel.onMultiple('inputEvent', this.engine.handleInput);
        this.channel.onMultiple('pluginStartingIn', data => this.channel.broadcast('pluginStartingOut', data));
        this.channel.onMultiple('pluginEndingIn', data => this.channel.broadcast('pluginEndingOut', data));
        this.channel.onMultiple('pluginEventIn', data => this.channel.broadcast('pluginEventOut', data));
        this.channel.onMultiple('getPlugins', socket => {
            const fs = require('fs');
            const path = require('path');
            let plugins = [];
            try {
                plugins = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugins.json')).toString('utf8'));
                this.channel.emitTo('pluginsList', plugins, socket);
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
        this.channel.broadcast('gotoSlide', { slide: currentState.currentSlide });
        this.previousState = currentState;
    }
}
