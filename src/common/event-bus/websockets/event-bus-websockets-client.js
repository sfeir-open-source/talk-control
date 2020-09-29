'use strict';

import socketIO from 'socket.io-client';
import { EventBus } from '../event-bus';
import { eventBusLogger } from '@event-bus/event-bus-logger';

/**
 * @classdesc SocketClient based EventBus implementation
 * @class EventBusWebsocketsClient
 * @augments EventBus
 */
export class EventBusWebsocketsClient extends EventBus {
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
    onMultiple(key, callback) {
        super.onMultiple(key, callback);
        this.io.on(key, callback);
    }

    /**
     * Register a callback on a key locally and for each socket connected
     *
     * @param {string} key - Event key to which attach the callback and attach each socket
     * @param {*} callback - Function to call when key event is fired
     * @throws Will throw an error if key is not specified
     */
    on(key, callback) {
        try {
            super.on(key, callback);
            this.onMultiple(key, callback);
        } catch (e) {
            eventBusLogger.log('on event bus client error: ', [key, e.message], true);
        }
    }

    /**
     * Broadcast data for each local callback and each connected socket
     *
     * @param {string} key - Event key to fire
     * @param {any} data - Data to broadcast
     * @throws Will throw an error if key is not specified
     */
    broadcast(key, data) {
        // Inner broadcast (same app)
        super.broadcast(key, data);
        // System broadcast (several devices)
        this.io.emit(key, data);
    }

    /**
     * Emit data for the socket passed in parameter on given event key
     *
     * @param {string} key - Event name
     * @param {any} data - Values
     * @param {any} socket - Socket to which the event will be sent
     */
    emitTo(key, data, socket) {
        // Call for sanity checks
        super.emitTo(key, data, socket);

        socket.emit(key, data);
    }
}
