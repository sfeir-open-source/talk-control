'use strict';

import { EventBus } from '@event-bus/event-bus.js';
import socketIO, { Socket } from 'socket.io';

/**
 * @classdesc Sockets based EventBus implementation
 * @class EventBusWebsocketsServer
 * @augments EventBus
 */
export class EventBusWebsocketsServer extends EventBus {
    /**
     * Class constructor
     *
     * @param {*} server - The server to connect
     */
    constructor(server) {
        super();
        this.sockets = [];
        this.io = socketIO(server);
        this.io.on('connection', socket => {
            console.log('### connected', {
                id: socket.id,
                from: socket.handshake.headers && socket.handshake.headers.referer ? socket.handshake.headers.referer : 'unknown'
            });
            this.sockets.push(socket);
            // Subscribe new socket on existing keys
            for (const key in this.callBacks) {
                this.on(key, null, socket);
            }
            // When disconnected, remove socket from the array
            socket.on('disconnect', () => {
                console.log('### disconnected', {
                    id: socket.id,
                    from: socket.handshake.headers && socket.handshake.headers.referer ? socket.handshake.headers.referer : 'unknown'
                });
                const index = this.sockets.indexOf(socket);
                this.sockets.splice(index, 1);
            });
        });
    }

    /**
     * Register a callback on a key locally and for each socket connected or a specific one
     *
     * @param {string} key - Event key to which attach the callback and attach each socket
     * @param {*} callback - Function to call when key event is fired
     * @param {Socket} socket - Specific socket to attach the key to
     * @throws Will throw an error if key is not specified
     */
    on(key, callback, socket) {
        if (callback) {
            super.on(key, callback);
        }
        // When an event is fired from a socket, we call emit so that we trigger local callbacks
        const socketCallback = message => this.emit(key, message, false);
        if (socket) {
            socket.on(key, socketCallback);
        } else {
            this.sockets.forEach(socket => socket.on(key, socketCallback));
        }
    }

    /**
     * Emit data for each local callback and each connected socket
     *
     * @param {string} key - Event key to fire
     * @param {any} data - Data to emit
     * @param {boolean} broadcast - Set false if the event must not be broadcasted on network
     * @throws Will throw an error if key is not specified
     */
    emit(key, data, broadcast = true) {
        // Inner
        super.emit(key, data);

        if (broadcast) {
            this.io.emit(key, data);
        }
    }
}
