'use strict';

import { EventBusResolver } from '@event-bus/event-bus-resolver';
import { isUrlValid } from '@helpers/helpers.js';

/**
 * @classdesc Class that handle the events from the remote client
 * @class
 */
export class TalkControlMaster {
    /**
     * Class constructor
     */
    constructor() {
        this.eventBus = new EventBusResolver({
            client: true,
            server: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
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

            // If url invalid, show an error
            document.getElementById('urlError').classList.add('is-hidden');
            if (!isUrlValid(url)) {
                document.getElementById('stageFrame').classList.add('is-hidden');
                document.getElementById('urlError').classList.remove('is-hidden');
                return;
            }

            document.getElementById('stageFrame').src = url;
            document.getElementById('stageFrame').classList.remove('is-hidden');
        };

        validateUrl.addEventListener('click', displaySlideshow);
        inputPresentation.addEventListener('keypress', e => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                displaySlideshow();
            }
        });

        this.afterInitialisation();
    }

    /**
     * Do actions once the server send the 'initialized' event
     */
    afterInitialisation() {
        this.eventBus.socketBus.on('initialized', () => document.addEventListener('keyup', this.onKeyUp.bind(this)));
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
        }
        if (action) {
            this.eventBus.socketBus.emit('keyPressed', { key: action });
        }
    }
}
