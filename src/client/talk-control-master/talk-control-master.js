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
        // 'querySelectorAllDeep' enable search inside children's shadow-dom
        querySelectorAllDeep('iframe').forEach(frame => this.frames.push(frame));
        this.focusFrame = this.frames.find(frame => frame.getAttribute('focus') !== null) || this.frames[0];

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
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'initialized', data => this.eventBus.emit(MASTER_SERVER_CHANNEL, 'init', data));
        // Start listening on keys once the server is initialized
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'initialized', () => this.eventBus.on(MASTER_SLAVE_CHANNEL, 'keyboardEvent', this.onKeyboardEvent.bind(this)));
        // Forward "gotoSlide" events to slave
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'gotoSlide', data => this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'gotoSlide', data));
        // Forward "showNotes" events to slave
        this.eventBus.on(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', data => this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToSlave', data));
    }

    onKeyboardEvent(event) {
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
            this.eventBus.emit(MASTER_SERVER_CHANNEL, 'keyboardEvent', { key: action });
        }
    }

    forwardEvents() {
        const forward = (key => data => this.eventBus.emit(MASTER_SLAVE_CHANNEL, key, data)).bind(this);
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'slideNumber', forward('slideNumber'));
        this.eventBus.on(MASTER_SERVER_CHANNEL, 'currentSlide', forward('currentSlide'));
    }

    onFramesLoaded() {
        this.eventBus.emit(MASTER_SLAVE_CHANNEL, 'init');
        this.focusFrame.focus();
        document.addEventListener('click', () => this.focusFrame.focus());
    }
}
