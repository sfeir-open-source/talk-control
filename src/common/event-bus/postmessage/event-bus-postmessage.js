'use strict';

import { EventBus } from '../event-bus.js';

/**
 * @classdesc Event bus implementation that fire events through window
 * @class EventBusPostMessage
 * @augments EventBus
 */
export class EventBusPostMessage extends EventBus {
    /**
     * Class constructor
     *
     * @param {*} params -
     */
    constructor(params) {
        super();
        this.windows = [window.parent];
        if (params.frames) {
            this.windows = [...this.windows, ...params.frames];
        }
        window.addEventListener('message', this._receiveMessageWindow.bind(this), false);
    }

    /**
     * Broadcast data via window and for each callback registered on given event key
     *
     * @param {string} key - Event key to fire
     * @param {any} data - Data to broadcast
     * @throws Will throw an error if key is not specified
     */
    broadcast(key, data) {
        super.broadcast(key, data);
        // Inner broadcast (same app)
        this.windows.forEach(w =>
            w.postMessage(
                {
                    type: key,
                    data
                },
                '*'
            )
        );
    }

    /**
     * Emit data for the dedicated channel passed in parameter on given event key
     * @param {string} key
     * @param {any} data
     * @param {any} channel
     */
    emit(key, data, channel) {
        // Call for sanity checks
        super.emit(key, data, channel);

        channel.postMessage(
            {
                type: key,
                data
            },
            '*'
        );
    }

    /**
     * Handle message reception from window
     *
     * @param {MessageEvent} message - message to forward
     */
    _receiveMessageWindow(message) {
        if (!message || !message.data) {
            return;
        }

        if (typeof message.data === 'object' && message.data.type) {
            const callBacks = super.getCallbacks(message.data.type);
            if (callBacks && callBacks.length > 0) {
                callBacks.forEach(callback => callback(message.data.data));
            }
        }
    }
}
