'use strict';

import { CONTROLLER_COMPONENT_CHANNEL, CONTROLLER_SERVER_CHANNEL, EventBusResolver } from '@event-bus/event-bus-resolver';
import pluginService from '@services/plugin';

export const ERROR_TYPE_SCRIPT_NOT_PRESENT = 'script_not_present';

/**
 * @class TCController
 * @classdesc Manage the control flow through event buses
 */
export class TCController {
    /**
     * @param {string} server - server address to connect to
     */
    constructor(server) {
        this.server = server;

        this.serverChannel = EventBusResolver.channel(CONTROLLER_SERVER_CHANNEL, { server });
        this.componentChannel = EventBusResolver.channel(CONTROLLER_COMPONENT_CHANNEL, { deep: true });
    }

    /**
     * Initialize the control by plumbing event channels and loading the presentation
     */
    init() {
        this._bindEvents();
        this.loadPresentation(this._resolvePresentationUrl());
    }

    /**
     * Manage control flows by coordinating components and server events (listening and forwarding)
     *
     * @private
     */
    _bindEvents() {
        this.componentChannel.on('initialized', data => {
            this.serverChannel.broadcast('init', data);
            this._loadPlugins();
        });

        // slides
        this.serverChannel.on('gotoSlide', data => this.componentChannel.broadcast('gotoSlide', data));

        // plugin start and stop flow
        this.componentChannel.on('pluginStartingIn', data => this.serverChannel.broadcast('pluginStartingIn', data));
        this.componentChannel.on('pluginEndingIn', data => this.serverChannel.broadcast('pluginEndingIn', data));

        this.serverChannel.on('pluginStartingOut', ({ pluginName }) => pluginService.activatePluginOnController(pluginName, this));
        this.serverChannel.on('pluginEndingOut', ({ pluginName }) => pluginService.deactivatePluginOnController(pluginName, this));

        this.componentChannel.on('pluginEventIn', data => this.serverChannel.broadcast('pluginEventIn', data));
        this.serverChannel.on('pluginEventOut', data => this.componentChannel.broadcast(data.origin, data));

        // pointer
        this.componentChannel.on('sendPointerEventToController', data => this.serverChannel.broadcast('sendPointerEventToController', data));
        this.serverChannel.on('pointerEvent', data => this.componentChannel.broadcast('pointerEvent', data));

        // notes
        this.componentChannel.on('sendNotesToController', data => this.componentChannel.broadcast('sendNotesToComponent', data));

        // presentation
        this.componentChannel.on('presentationLoaded', () => this._onPresentationLoaded());
    }

    /**
     * Fetch and load plugins from server. Activate self-activating plugins
     *
     * @private
     */
    _loadPlugins() {
        this.serverChannel.on('pluginsList', plugins => {
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                if (plugin.autoActivate) pluginService.activatePluginOnController(plugin.name, this);
                else this.componentChannel.broadcast('addToPluginsMenu', { pluginName: plugin.name });
            }
        });
        this.serverChannel.broadcast('getPlugins');
    }

    /**
     * Callback after the presentation is loaded
     *
     * @private
     */
    _onPresentationLoaded() {
        this.checkHealthPresentation(100).then(status => {
            if (status === 'ok') this.componentChannel.broadcast('init');
            else this.componentChannel.broadcast('error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
        });
    }

    /**
     * Check that the presentation is accessible through event bus (ping pong system)
     *
     * @param {number} timeout - time before fail check
     * @returns {Promise<'ok'|'ko'>} - Health status promise
     */
    checkHealthPresentation(timeout) {
        // We create a timeoutPromise to race this promise with a ping message in order
        // to check if talkControl component is present in the iframe.
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('ko'), timeout));
        const pongPromise = new Promise(resolve => {
            this.componentChannel.on('pong', () => resolve('ok'));
            this.componentChannel.broadcast('ping');
        });

        return Promise.race([timeoutPromise, pongPromise]);
    }

    /**
     * Load the presentation (sending command)
     *
     * @param {string} url - Presentation URL
     */
    loadPresentation(url) {
        this.componentChannel.broadcast('loadPresentation', url);
    }

    /**
     * Resolve what the controlled presentation URL should be and returns it
     *
     * @returns {string} presentation URL
     * @private
     */
    _resolvePresentationUrl() {
        let url = sessionStorage.getItem('presentationUrl');

        if (url.includes('tc-presentation-url')) {
            const presentationUrl = url.split('tc-presentation-url=')[1];
            return `${this.server}/patcher?tc-presentation-url=${presentationUrl}`;
        }
        return url;
    }
}
