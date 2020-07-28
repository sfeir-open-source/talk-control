'use strict';

import { EventBusResolver, MASTER_SERVER_CHANNEL, MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';
import config from '@config/config';
import { loadPluginModule } from '@plugins/plugin-loader';

/**
 * @class TalkControlMaster
 * @classdesc Class that handle the events from the remote client
 */
export class TalkControlMaster {
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

        this.eventBusMaster = new EventBusResolver({
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
        this.eventBusMaster.on(MASTER_SLAVE_CHANNEL, 'initialized', data => this.eventBusMaster.emit(MASTER_SERVER_CHANNEL, 'init', data));
        // Forward "gotoSlide" events to slave
        this.eventBusMaster.on(MASTER_SERVER_CHANNEL, 'gotoSlide', data => this.eventBusMaster.emit(MASTER_SLAVE_CHANNEL, 'gotoSlide', data));
        // Forward "showNotes" events to slave
        this.eventBusMaster.on(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', data => this.eventBusMaster.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToSlave', data));

        this._initPlugins();

        // Forward "sendPointerEventToMaster" to server to broadcast to all masters
        this.eventBusMaster.on(MASTER_SLAVE_CHANNEL, 'sendPointerEventToMaster', data => this.eventBusMaster.emit(MASTER_SERVER_CHANNEL, 'sendPointerEventToMaster', data));
        // Forward "pointerEvent" events to slave
        this.eventBusMaster.on(MASTER_SERVER_CHANNEL, 'pointerEvent', data => this.eventBusMaster.emit(MASTER_SLAVE_CHANNEL, 'pointerEvent', data));
    }

    _registerPlugin(plugin, name) {
        if (plugin.usedByAComponent) { // Plugins used by a component and need slave (ex: keyboardInput)
            this.eventBusMaster.on(MASTER_SLAVE_CHANNEL, plugin.type, event => this.eventBusMaster.emit(MASTER_SERVER_CHANNEL, plugin.type, event));
            this.eventBusMaster.emit(MASTER_SLAVE_CHANNEL, 'registerPlugin', { pluginName: name });
        } else { // Other plugins like bluetooth devices
            plugin.init();
            plugin.onEvent(event => this.eventBusMaster.emit(MASTER_SERVER_CHANNEL, plugin.type, event));
        }
    }

    _registerDynamicPlugin(name){
        loadPluginModule(name).then(pluginModule => {
            this._registerPlugin(pluginModule.instance, name)
        });
    }

    _initPlugins() {
        this.eventBusMaster.on(MASTER_SERVER_CHANNEL, 'activatePlugins', plugins => {
            console.log('Plugins to activate', plugins);
            for (const plugin of plugins) {
                // TODO: check if already initialized and usedByAComponent
                this._registerDynamicPlugin(plugin.name);
            }
        });

        this.eventBusMaster.emit(MASTER_SERVER_CHANNEL, 'getPluginsToActivate');
    }

    onTouchEvent(event) {
        const xDiff = event.position.touchstart.clientX - event.position.touchend.clientX;
        const xDiffPositive = xDiff < 0 ? xDiff * -1 : xDiff;
        const yDiff = event.position.touchstart.clientY - event.position.touchend.clientY;
        const yDiffPositive = yDiff < 0 ? yDiff * -1 : yDiff;
        let direction = '';

        if (xDiffPositive <= 20 && yDiffPositive <= 20) {
            direction = 'none';
        } else if (xDiffPositive > yDiffPositive) {
            direction = xDiff > 0 ? 'left' : 'right';
        } else if (yDiffPositive >= xDiffPositive) {
            direction = yDiff > 0 ? 'up' : 'down';
        }

        this.eventBusMaster.emit(MASTER_SERVER_CHANNEL, 'touchEvent', { direction });
    }

    forwardEvents() {
        const forward = (key => data => this.eventBusMaster.emit(MASTER_SLAVE_CHANNEL, key, data)).bind(this);
        this.eventBusMaster.on(MASTER_SERVER_CHANNEL, 'slideNumber', forward('slideNumber'));
        this.eventBusMaster.on(MASTER_SERVER_CHANNEL, 'currentSlide', forward('currentSlide'));
    }

    onFramesLoaded() {
        this.eventBusMaster.emit(MASTER_SLAVE_CHANNEL, 'init');
        this.focusFrame.focus();
        document.addEventListener('click', () => this.focusFrame.focus());
    }
}
