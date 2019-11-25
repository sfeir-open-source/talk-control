'use strict';

import { EventBusResolver, MASTER_SERVER_CHANNEL, MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';

/**
 * @classdesc Class that handle the events from the remote client
 * @class
 */
export class TalkControlMaster {
    /**
     * Class constructor
     *
     * @param {string} server - server adress to connect to
     */
    constructor(server) {
        this.frames = [];
        querySelectorAllDeep('iframe').forEach(frame => this.frames.push(frame));
        this.eventBus = new EventBusResolver({
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
                    if (++frameCount >= this.frames.length) this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'init');
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
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'initialized', data => this.eventBus.emit(MASTER_SERVER_CHANNEL, 'init', data));
        // Start listening on keys once the server is initialized
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'initialized', () => addEventListener('keyup', this._onKeyUp.bind(this)));
        // Forward "gotoSlide" events to slave
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'gotoSlide', data => this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'gotoSlide', data));
        // Forward "showNotes" events to slave
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', data => this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToSlave', data));
    }

    _onKeyUp(event) {
        let action = '';
        switch (event.key) {
            case 'Down': // IE specific value
            case 'ArrowDown':
                // Do something for "down arrow" key press.
                action = 'arrowDown';
                break;
            case 'Up': // IE specific value
            case 'ArrowUp':
                // Do something for "up arrow" key press.
                action = 'arrowUp';
                break;
            case 'Left': // IE specific value
            case 'ArrowLeft':
                // Do something for "left arrow" key press.
                action = 'arrowLeft';
                break;
            case 'Right': // IE specific value
            case 'ArrowRight':
                // Do something for "right arrow" key press.
                action = 'arrowRight';
                break;
            case ' ':
                // Do something for "space" key press
                action = 'space';
                break;
        }
        if (action) {
            this.eventBus.emit(MASTER_SERVER_CHANNEL, 'keyPressed', { key: action });
        }
    }

    forwardEvents() {
        const forward = (key => data => this.eventBus.emit(MASTER_SLAVE_CHANNEL, key, data)).bind(this);
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'slideNumber', forward('slideNumber'));
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'currentSlide', forward('currentSlide'));
    }
}
