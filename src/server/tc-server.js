'use strict';

import { EngineResolver } from './engines/engine-resolver';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import pluginConfigService from '@services/plugin-config';

/**
 * @class TCServer
 * @classdesc Manage the control state changes
 */
export class TCServer {
    /**
     * @param {http.Server} server - Http server
     */
    constructor(server) {
        this.channel = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
    }

    /**
     * Initialize the control by initializing an engine and registering event handlers
     *
     * @param {string} engineName - Name of the engine to use
     */
    init(engineName) {
        this.engine = EngineResolver.getEngine(engineName);
        this.channel.onMultiple('init', data => {
            this.engine.init(data);
            this.channel.broadcast('pluginsList', pluginConfigService.getPlugins());
        });
        this.channel.onMultiple('inputEvent', input => this.engine.handleInput(input));
        this.channel.onMultiple('pluginStartingIn', data => this.channel.broadcast('pluginStartingOut', data));
        this.channel.onMultiple('pluginEndingIn', data => this.channel.broadcast('pluginEndingOut', data));
        this.channel.onMultiple('pluginEventIn', data => this.channel.broadcast('pluginEventOut', data));

        this.engine.store.subscribe(() => this._broadcastStateChanges());
    }

    /**
     * Broadcast an event depending on state changes
     */
    _broadcastStateChanges() {
        this.channel.broadcast('gotoSlide', { slide: this.engine.store.getState().currentSlide });
    }
}
