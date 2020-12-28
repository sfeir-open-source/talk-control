'use strict';

import pluginService from '@services/plugin';
import { CONTROLLER_COMPONENT_CHANNEL, CONTROLLER_SERVER_CHANNEL, EventBusResolver } from '@event-bus/event-bus-resolver';

export const ERROR_TYPE_SCRIPT_NOT_PRESENT = 'script_not_present';

/**
 * @class TCController
 * @classdesc Manage the control flow through event buses
 */
export class TCController {
    /**
     * @param {string} server - Server URL
     */
    constructor(server) {
        this.serverChannel = EventBusResolver.channel(CONTROLLER_SERVER_CHANNEL, { server });
        this.componentChannel = EventBusResolver.channel(CONTROLLER_COMPONENT_CHANNEL, { deep: true });
    }

    /**
     * Initialize the control by plumbing event channels and loading the presentation
     *
     * @param {string} presentationUrl - Presentation URL
     */
    init(presentationUrl) {
        this._bindPreControlEvents();
        this._bindControlEvents();
        this._bindPluginStartStopEvents();
        this._bindPluginEvents();

        this._loadPresentation(presentationUrl);
    }

    /**
     * Bind events related to the preperation flow
     * Includes slides counting, presentation health checking then control kick starting
     *
     * @private
     */
    _bindPreControlEvents() {
        const slideCount = { loading: 0, loaded: 0 };
        this.componentChannel.on('slideLoading', () => slideCount.loading++);
        this.componentChannel.on('slideLoaded', () => {
            if (++slideCount.loaded !== slideCount.loading) return;

            this._checkHealthPresentation(100).then(status => {
                if (status === 'ok') this.componentChannel.broadcast('init');
                else this.componentChannel.broadcast('error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
            });
        });
    }

    /**
     * Bind events related to the control flow
     * Includes initialization of server, plugins loading. current slide control, pointer control ...
     *
     * @private
     */
    _bindControlEvents() {
        this.componentChannel.on('initialized', data => this.serverChannel.broadcast('init', data));
        this.serverChannel.on('gotoSlide', data => this.componentChannel.broadcast('gotoSlide', data));
        this.componentChannel.on('sendNotesToController', data => this.componentChannel.broadcast('sendNotesToComponent', data));
    }

    /**
     * Bind events related to plugin start/stop flow
     *
     * @private
     */
    _bindPluginStartStopEvents() {
        this.serverChannel.on('pluginsList', plugins => {
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                if (plugin.autoActivate) pluginService.activateOnController(plugin.name, this);
                else this.componentChannel.broadcast('addToPluginsMenu', { pluginName: plugin.name });
            }
        });

        this.componentChannel.on('pluginStartingIn', data => this.serverChannel.broadcast('pluginStartingIn', data));
        this.componentChannel.on('pluginEndingIn', data => this.serverChannel.broadcast('pluginEndingIn', data));
        this.serverChannel.on('pluginStartingOut', ({ pluginName }) => pluginService.activateOnController(pluginName, this));
        this.serverChannel.on('pluginEndingOut', ({ pluginName }) => pluginService.deactivateOnController(pluginName, this));
    }

    /**
     * Bind plugin events (events forwarding)
     *
     * @private
     */
    _bindPluginEvents() {
        this.componentChannel.on('pluginEventIn', data => this.serverChannel.broadcast('pluginEventIn', data));
        this.serverChannel.on('pluginEventOut', data => this.componentChannel.broadcast(data.origin, data));
    }

    /**
     * Check that the presentation is accessible through event bus (ping pong system)
     *
     * @param {number} timeout - time before fail check
     * @returns {Promise<'ok'|'ko'>} - Health status promise
     */
    _checkHealthPresentation(timeout) {
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
    _loadPresentation(url) {
        this.componentChannel.broadcast('loadPresentation', url);
    }
}
