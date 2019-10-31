'use strict';

import { EventBus } from '../event-bus.js';

/**
 * @classdesc Event bus implementation that fire events through window
 * @class
 * @augments EventBus
 */
export class EventBusPostMessage extends EventBus {
    /**
     * Class constructor
     */
    constructor() {
        super();
        window.addEventListener('message', this._receiveMessageWindow.bind(this), false);
    }

    /**
     * Emit data via window and for each callback registered on given event key
     *
     * @param {string} key - Event key to fire
     * @param {any} data - Data to emit
     * @throws Will throw an error if key is not specified
     */
    emit(key, data) {
        super.emit(key, data);
        // Inner broadcast (same app)
        window.postMessage(
            JSON.stringify({
                type: key,
                data
            }),
            '*'
        );
    }

    /**
     * Handle message reception from window
     *
     * @param {MessageEvent} message - message to forward
     */
    _receiveMessageWindow(message) {
        if (!message || !message.data || message.data.length === 0) {
            return;
        }
        if (message.data.charAt(0) === '{' && message.data.charAt(message.data.length - 1) === '}') {
            message = JSON.parse(message.data);
            const callBacks = super.getCallbacks(message.type);
            if (callBacks && callBacks.length > 0) {
                callBacks.forEach(callback => callback(message));
            }
        }
    }
}
