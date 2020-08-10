'use strict';

import { EventBusResolver, CONTROLLER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import { loadPluginModule } from '@plugins/plugin-loader';

/**
 * @class TCController
 * @classdesc Class that handle the events from the remote client
 */
export class TCController {
    /**
     * Class constructor
     *
     * @param {string} server - server adress to connect to
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
                    if (++frameCount >= this.frames.length) this.onFramesLoaded();
                })
        );

        this.afterInitialisation();
        this.forwardEvents();
    }

    /**
     * Do actions once the server send the 'initialized' event
     */
    afterInitialisation() {
        // Forward initialization event to server
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'initialized', data => {
            this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'init', data);
            this._initPlugins();
        });
        
        // Forward "showNotes" events to slave
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToController', data => this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToComponent', data));
        // Forward "gotoSlide" events to slave
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'gotoSlide', data => this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'gotoSlide', data));
        
        // Forward plugin event to server to broadcast it to all controllers
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'pluginEventIn', data => this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'pluginEventIn', data));
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pluginEventOut', data => this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, data.origin, data));
        
        // Forward "sendPointerEventToController" to server to broadcast to all controllers
        this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, 'sendPointerEventToController', data => this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'sendPointerEventToController', data));
        // Forward "pointerEvent" events to slave
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'pointerEvent', data => this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pointerEvent', data));
    }

    _registerPlugin(plugin, name) {
        if (plugin.usedByAComponent) { // Plugins used by a component and need slave (ex: keyboard)
            this.eventBusController.on(CONTROLLER_COMPONENT_CHANNEL, plugin.type, event => this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, plugin.type, event));
            this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'registerPlugin', { pluginName: name });
        } else {
            // Other plugins like bluetooth devices
            plugin.init();
            plugin.onEvent(event => this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, plugin.type, event));
        }
    }

    _registerDynamicPlugin(name) {
        loadPluginModule(name).then(pluginModule => this._registerPlugin(pluginModule.instance, name));
    }

    _initPlugins() {
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'activatePlugins', plugins => {
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                this._registerDynamicPlugin(plugin.name);
            }
        });

        this.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, 'getPluginsToActivate');
    }

    forwardEvents() {
        const forward = (key => data => this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, key, data)).bind(this);
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'slideNumber', forward('slideNumber'));
        this.eventBusController.on(CONTROLLER_SERVER_CHANNEL, 'currentSlide', forward('currentSlide'));
    }

    onFramesLoaded() {
        this.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'init');
        this.focusFrame.focus();
        document.addEventListener('click', () => this.focusFrame.focus());
    }
}
