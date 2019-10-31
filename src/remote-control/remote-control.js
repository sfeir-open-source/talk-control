'use-strict';

import { EventBusResolver } from '../common/event-bus/event-bus-resolver';
import { isUrlValid } from '../common/helpers/helpers';

/**
 * @classdesc Class that handle the events from the remote client
 * @class
 */
export class RemoteControl {
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
            const iframe = document.getElementById('stageFrame');
            const urlError = document.getElementById('urlError');

            urlError.innerHTML = '';

            // If url invalid, show an error
            if (!isUrlValid(url)) {
                urlError.innerHTML = 'URL is not valid';
                return;
            }

            // Hide url fields and show iframe
            document.getElementById('form-group').style.display = 'none';
            iframe.style.display = '';
            iframe.src = url;
        };

        validateUrl.addEventListener('click', displaySlideshow);
        inputPresentation.addEventListener('keypress', e => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                displaySlideshow();
            }
        });

        document.addEventListener('keyup', event => {
            let action = '';
            switch (event.key) {
                case 'Down': // IE specific value
                case 'ArrowDown':
                    // Do something for "down arrow" key press.
                    action = 'down';
                    break;
                case 'Up': // IE specific value
                case 'ArrowUp':
                    // Do something for "up arrow" key press.
                    action = 'up';
                    break;
                case 'Left': // IE specific value
                case 'ArrowLeft':
                    // Do something for "left arrow" key press.
                    action = 'left';
                    break;
                case 'Right': // IE specific value
                case 'ArrowRight':
                    // Do something for "right arrow" key press.
                    action = 'right';
                    break;
            }
            if (action) {
                this.eventBus.socketBus.emit('movement', { data: action });
            }
        });
    }
}
