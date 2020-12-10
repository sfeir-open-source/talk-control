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

        this.eventBusController = new EventBusResolver({
            client: true,
            server,
            postMessage: {
                frames: this.frames.map(frame => frame.contentWindow)
            }
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
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'initialized', data => {
            this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'init', data);
            this._initPlugins();
        });

        // Forward "showNotes" events to tc-component
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToController', data =>
            this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToComponent', data)
        );
        // Forward "gotoSlide" events to tc-component
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'gotoSlide', data => {
            console.log('GoToSlide');
            this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'gotoSlide', data);
        });

        // Forward plugin event to server to broadcast it to all controllers
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'pluginStartingIn', data =>
            this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginStartingIn', data)
        );
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'pluginEndingIn', data =>
            this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginEndingIn', data)
        );

        // Forward plugin event to server to broadcast it to all controllers
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'pluginEventIn', data =>
            this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginEventIn', data)
        );
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pluginEventOut', data =>
            this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, data.origin, data)
        );

        // Forward "sendPointerEventToController" to server to broadcast to all controllers
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'sendPointerEventToController', data =>
            this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'sendPointerEventToController', data)
        );
        // Forward "pointerEvent" events to tc-component
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pointerEvent', data =>
            this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pointerEvent', data)
        );
    }

    _initPlugins() {
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pluginsList', plugins => {
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                if (plugin.autoActivate) {
                    pluginService.activatePluginOnController(plugin.name, this);
                    continue;
                }

                this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'addToPluginsMenu', { pluginName: plugin.name });
            }

            this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pluginStartingOut', ({ pluginName }) =>
                pluginService.activatePluginOnController(pluginName, this)
            );
            this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pluginEndingOut', ({ pluginName }) =>
                pluginService.deactivatePluginOnController(pluginName, this)
            );
        });

        this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'getPlugins');
    }

    _forwardEvents() {
        const forward = (key => data => this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, key, data)).bind(this);
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'slideNumber', forward('slideNumber'));
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'currentSlide', forward('currentSlide'));
    }

    _onFramesLoaded() {
        // We create a timeoutPromise to race this promise with a ping message in order
        // to check if talkControl component is present in the iframe.
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('ko'), 1000));
        const pongPromise = new Promise(resolve => {
            this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'pong', () => resolve('ok'));
            this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'ping');
        });

        Promise.race([timeoutPromise, pongPromise]).then(value => {
            if (value === 'ok') {
                this.focusFrame.focus();
                document.addEventListener('click', () => this.focusFrame.focus());
                this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'init');
            } else {
                this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'error', {
                    type: ERROR_TYPE_SCRIPT_NOT_PRESENT
                });
            }
        });
    }
}
