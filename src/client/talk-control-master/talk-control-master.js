'use strict';

import { EventBusResolver, MAIN_CHANNEL, SECONDARY_CHANNEL } from '@event-bus/event-bus-resolver';
import { isUrlValid } from '@helpers/helpers.js';

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
        const frames = [];
        document.querySelectorAll('iframe').forEach(frame => frames.push(frame.contentWindow));
        this.eventBus = new EventBusResolver({
            client: true,
            server,
            postMessage: {
                frames
            }
        });
    }

    /**
     * Listen on event keys and display iframe when slideshow url is given
     */
    init() {
        const inputPresentation = document.getElementById('inputPresentation');
        const validateUrl = document.getElementById('btnValidate');
        const displaySlideshow = () => {
            const url = inputPresentation.value;
            const stageFrame = document.getElementById('stageFrame');
            // If url invalid, show an error
            document.getElementById('urlError').classList.add('is-hidden');
            if (!isUrlValid(url)) {
                stageFrame.classList.add('is-hidden');
                document.getElementById('urlError').classList.remove('is-hidden');
                return;
            }

            stageFrame.src = url;
            stageFrame.classList.remove('is-hidden');
            document.getElementById('form').classList.add('is-hidden');
            stageFrame.onload = () => {
                this.eventBus.emit(SECONDARY_CHANNEL, 'init');
            };
        };

        validateUrl.addEventListener('click', displaySlideshow);
        inputPresentation.addEventListener('keypress', e => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                displaySlideshow();
            }
        });

        this.afterInitialisation();
        this.forwardEvents();
    }

    /**
     * Do actions once the server send the 'initialized' event
     */
    afterInitialisation() {
        // Forward initialization event to server
        this.eventBus.on(SECONDARY_CHANNEL, 'initialized', data => this.eventBus.emit(MAIN_CHANNEL, 'init', data));
        // Start listening on keys once the server is initialized
        this.eventBus.on(MAIN_CHANNEL, 'initialized', () => addEventListener('keyup', this._onKeyUp.bind(this)));
        // Forward "gotoSlide" events to slave
        this.eventBus.on(MAIN_CHANNEL, 'gotoSlide', data => this.eventBus.emit(SECONDARY_CHANNEL, 'gotoSlide', data));
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
            this.eventBus.emit(MAIN_CHANNEL, 'keyPressed', { key: action });
        }
    }

    forwardEvents() {
        const forward = (key => data => this.eventBus.emit(SECONDARY_CHANNEL, key, data)).bind(this);
        this.eventBus.on(MAIN_CHANNEL, 'slideNumber', forward('slideNumber'));
        this.eventBus.on(MAIN_CHANNEL, 'currentSlide', forward('currentSlide'));
    }
}
