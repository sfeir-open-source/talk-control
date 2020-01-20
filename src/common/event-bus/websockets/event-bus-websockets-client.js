'use strict';

import socketIO from 'socket.io-client';
import { EventBus } from '../event-bus';

/**
 * @classdesc SocketClient based EventBus implementation
 * @class SocketEventBusClient
 * @augments EventBus
 */
export class SocketEventBusClient extends EventBus {
    constructor(server) {
        super();
        this.sockets = [];
        this.io = socketIO.connect(server);
    }

    /**
     * Register a callback on a key locally and for each socket connected
     *
     * @param {string} key - Event key to which attach the callback and attach each socket
     * @param {*} callback - Function to call when key event is fired
     * @throws Will throw an error if key is not specified
     */
    on(key, callback) {
        super.on(key, callback);
        this.io.on(key, callback);
    }

    /**
     * Emit data for each local callback and each connected socket
     *
     * @param {string} key - Event key to fire
     * @param {any} data - Data to emit
     * @throws Will throw an error if key is not specified
     */
    emit(key, data) {
        // Inner broadcast (same app)
        super.emit(key, data);
        // System broadcast (several devices)
        this.io.emit(key, data);
    }
}
