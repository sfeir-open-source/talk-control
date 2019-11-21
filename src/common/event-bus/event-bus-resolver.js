'use strict';

import { SocketEventBus } from './websockets/event-bus-websockets.js';
import { SocketEventBusClient } from './websockets/event-bus-websockets-client.js';
import { EventBusPostMessage } from './postmessage/event-bus-postmessage.js';

export const MAIN_CHANNEL = 'MAIN_CHANNEL';
export const SECONDARY_CHANNEL = 'SECONDARY_CHANNEL';

/**
 * @classdesc Instantiate event buses based on params given
 * @class
 */
export class EventBusResolver {
    constructor(params) {
        this.channels = {};

        if (params.server) {
            if (params.client) {
                this.channels[MAIN_CHANNEL] = new SocketEventBusClient(params.server);
            } else {
                this.channels[MAIN_CHANNEL] = new SocketEventBus(params.server);
            }
        }

        if (typeof window != 'undefined') {
            this.channels[SECONDARY_CHANNEL] = new EventBusPostMessage(params.postMessage || {});
        }
    }

    /**
     *
     * @param {MAIN_CHANNEL | SECONDARY_CHANNEL} dest - Channel to which to emit
     * @param {string} key - Event key to fire
     * @param {*} data - Data to emit
     * @throws Will throw an error if key is not specified or if dest is incorrect
     */
    emit(dest, key, data) {
        if (![MAIN_CHANNEL, SECONDARY_CHANNEL].includes(dest)) {
            throw new Error(`'${dest}' is not a known destination.`);
        }
        this.channels[dest].emit(key, data);
    }

    /**
     *
     * @param {MAIN_CHANNEL | SECONDARY_CHANNEL} src - Source channel from which to listen
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    on(src, key, callback) {
        if (![MAIN_CHANNEL, SECONDARY_CHANNEL].includes(src)) {
            throw new Error(`'${src}' is not a known source.`);
        }
        this.channels[src].on(key, callback);
    }
}
