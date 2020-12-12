'use strict';

import { EventBusResolver, CONTROLLER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import pluginService from '@services/plugin';

export const ERROR_TYPE_SCRIPT_NOT_PRESENT = 'script_not_present';

/**
 * @class TCController
 * @classdesc Class that handle the events from the remote client
 */
export class TCController {
    /**
     * Class constructor
     *
     * @param {string} server - server address to connect to
     */
    constructor(server) {
        this.frames = [];
        // 'querySelectorAllDeep' enable search inside children's shadow-dom
        querySelectorAllDeep('iframe').forEach(frame => this.frames.push(frame));
        this.focusFrame = this.frames.find(frame => frame.getAttribute('focus') !== null) || this.frames[0];

        this.serverChannel = EventBusResolver.channel(CONTROLLER_SERVER_CHANNEL, { server });
        this.componentChannel = EventBusResolver.channel(CONTROLLER_COMPONENT_CHANNEL, {
            frames: this.frames.map(frame => frame.contentWindow)
        });
    }

    /**
     * Listen on event keys and display iframe when slideshow url is given
     */
    init() {
        // Fire init event when all iframes are loaded
        let frameCount = 0;
        this.frames.forEach(
            frame =>
                (frame.onload = () => {
                    if (++frameCount >= this.frames.length) this._onFramesLoaded();
                })
        );

        this._afterInitialisation();
        this._forwardEvents();
    }

    /**
     * Do actions once the server send the 'initialized' event
     */
    _afterInitialisation() {
        // Forward initialization event to server
        this.componentChannel.on('initialized', data => {
            this.serverChannel.broadcast('init', data);
            this._initPlugins();
        });

        // Forward "showNotes" events to tc-component
        this.componentChannel.on('sendNotesToController', data => this.componentChannel.broadcast('sendNotesToComponent', data));
        // Forward "gotoSlide" events to tc-component
        this.serverChannel.on('gotoSlide', data => {
            console.log('GoToSlide');
            this.componentChannel.broadcast('gotoSlide', data);
        });

        // Forward plugin event to server to broadcast it to all controllers
        this.componentChannel.on('pluginStartingIn', data => this.serverChannel.broadcast('pluginStartingIn', data));
        this.componentChannel.on('pluginEndingIn', data => this.serverChannel.broadcast('pluginEndingIn', data));

        // Forward plugin event to server to broadcast it to all controllers
        this.componentChannel.on('pluginEventIn', data => this.serverChannel.broadcast('pluginEventIn', data));
        this.serverChannel.on('pluginEventOut', data => this.componentChannel.broadcast(data.origin, data));

        // Forward "sendPointerEventToController" to server to broadcast to all controllers
        this.componentChannel.on('sendPointerEventToController', data => this.serverChannel.broadcast('sendPointerEventToController', data));
        // Forward "pointerEvent" events to tc-component
        this.serverChannel.on('pointerEvent', data => this.componentChannel.broadcast('pointerEvent', data));
    }

    _initPlugins() {
        this.serverChannel.on('pluginsList', plugins => {
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                if (plugin.autoActivate) {
                    pluginService.activatePluginOnController(plugin.name, this);
                    continue;
                }

                this.componentChannel.broadcast('addToPluginsMenu', { pluginName: plugin.name });
            }

            this.serverChannel.on('pluginStartingOut', ({ pluginName }) => pluginService.activatePluginOnController(pluginName, this));
            this.serverChannel.on('pluginEndingOut', ({ pluginName }) => pluginService.deactivatePluginOnController(pluginName, this));
        });

        this.serverChannel.broadcast('getPlugins');
    }

    _forwardEvents() {
        const forward = (key => data => this.componentChannel.broadcast(key, data)).bind(this);
        this.serverChannel.on('slideNumber', forward('slideNumber'));
        this.serverChannel.on('currentSlide', forward('currentSlide'));
    }

    _onFramesLoaded() {
        // We create a timeoutPromise to race this promise with a ping message in order
        // to check if talkControl component is present in the iframe.
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('ko'), 1000));
        const pongPromise = new Promise(resolve => {
            this.componentChannel.on('pong', () => resolve('ok'));
            this.componentChannel.broadcast('ping');
        });

        Promise.race([timeoutPromise, pongPromise]).then(value => {
            if (value === 'ok') {
                this.focusFrame.focus();
                document.addEventListener('click', () => this.focusFrame.focus());
                this.componentChannel.broadcast('init');
            } else {
                this.componentChannel.broadcast('error', {
                    type: ERROR_TYPE_SCRIPT_NOT_PRESENT
                });
            }
        });
    }
}
