'use strict';

import pluginService from '@services/plugin';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';

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
        this.controllerServerChannel = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
        this.controllerComponentChannel = EventBusResolver.channel(Channels.CONTROLLER_COMPONENT, { deep: true });
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
        this.controllerComponentChannel.on('presentationLoading', () => slideCount.loading++);
        this.controllerComponentChannel.on('presentationLoaded', () => {
            if (++slideCount.loaded !== slideCount.loading) return;

            this._checkTCClientPresence(100).then(status => {
                if (status === 'ok') this.controllerComponentChannel.broadcast('init');
                else this.controllerComponentChannel.broadcast('error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
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
        this.controllerComponentChannel.on('initialized', data => this.controllerServerChannel.broadcast('init', data));
        this.controllerServerChannel.on('gotoSlide', data => this.controllerComponentChannel.broadcast('gotoSlide', data));
        this.controllerComponentChannel.on('sendNotesToController', data => this.controllerComponentChannel.broadcast('sendNotesToComponent', data));
    }

    /**
     * Bind events related to plugin start/stop flow
     *
     * @private
     */
    _bindPluginStartStopEvents() {
        this.controllerServerChannel.on('pluginsList', plugins => {
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                if (plugin.autoActivate) pluginService.activateOnController(plugin.name, this);
                else this.controllerComponentChannel.broadcast('addToPluginsMenu', { pluginName: plugin.name });
            }
        });

        this.controllerComponentChannel.on('pluginStartingIn', data => this.controllerServerChannel.broadcast('pluginStartingIn', data));
        this.controllerComponentChannel.on('pluginEndingIn', data => this.controllerServerChannel.broadcast('pluginEndingIn', data));
        this.controllerServerChannel.on('pluginStartingOut', ({ pluginName }) => pluginService.activateOnController(pluginName, this));
        this.controllerServerChannel.on('pluginEndingOut', ({ pluginName }) => pluginService.deactivateOnController(pluginName, this));
    }

    /**
     * Bind plugin events (events forwarding)
     *
     * @private
     */
    _bindPluginEvents() {
        this.controllerComponentChannel.on('pluginEventIn', data => this.controllerServerChannel.broadcast('pluginEventIn', data));
        this.controllerServerChannel.on('pluginEventOut', data => this.controllerComponentChannel.broadcast(data.origin, data));
    }

    /**
     * Check that the presentation is accessible through event bus (ping pong system)
     *
     * @param {number} timeout - time before fail check
     * @returns {Promise<'ok'|'ko'>} - Health status promise
     */
    _checkTCClientPresence(timeout) {
        // We create a timeoutPromise to race this promise with a ping message in order
        // to check if talkControl component is present in the iframe.
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('ko'), timeout));
        const pongPromise = new Promise(resolve => {
            this.controllerComponentChannel.on('pong', () => resolve('ok'));
            this.controllerComponentChannel.broadcast('ping');
        });

        return Promise.race([timeoutPromise, pongPromise]);
    }

    /**
     * Load the presentation (sending command)
     *
     * @param {string} url - Presentation URL
     */
    _loadPresentation(url) {
        this.controllerComponentChannel.broadcast('loadPresentation', url);
    }
}
