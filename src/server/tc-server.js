'use strict';

import http from 'http';
import { EngineResolver } from './engines/engine-resolver';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { plugins } from '@services/config';

/**
 * @class TCServer
 * @classdesc Manage the control state changes
 */
export class TCServer {
    /**
     * @param {http.Server} server - Http server
     */
    constructor(server) {
        this.controllerServerChannel = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
    }

    /**
     * Initialize the control by initializing an engine and registering event handlers
     *
     * @param {string} engineName - Name of the engine to use
     */
    init(engineName) {
        this.engine = EngineResolver.getEngine(engineName);
        this.controllerServerChannel.onMultiple('init', data => {
            this.engine.init(data);
            this.controllerServerChannel.broadcast('pluginsList', plugins);
        });
        this.controllerServerChannel.onMultiple('inputEvent', input => this.engine.handleInput(input));
        this.controllerServerChannel.onMultiple('pluginStartingIn', data => this.controllerServerChannel.broadcast('pluginStartingOut', data));
        this.controllerServerChannel.onMultiple('pluginEndingIn', data => this.controllerServerChannel.broadcast('pluginEndingOut', data));
        this.controllerServerChannel.onMultiple('pluginEventIn', data => this.controllerServerChannel.broadcast('pluginEventOut', data));

        this.engine.store.subscribe(() => this._broadcastStateChanges());
    }

    /**
     * Broadcast an event depending on state changes
     */
    _broadcastStateChanges() {
        this.controllerServerChannel.broadcast('gotoSlide', { slide: this.engine.store.getState().currentSlide });
    }
}
