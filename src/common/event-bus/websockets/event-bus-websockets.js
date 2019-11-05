import { EventBus } from '../event-bus.js';
import socketIO, { Socket } from 'socket.io';

/**
 * @classdesc Sockets based EventBus implementation
 * @class
 * @augments EventBus
 */
export class SocketEventBus extends EventBus {
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
            console.log('### connection');
            this.sockets.push(socket);
            // Subscribe new socket on existing keys
            for (const key in this.callBacks) {
                this.on(key, null, socket);
            }
            // When disconnected, remove socket from the array
            socket.on('disconnect', () => {
                console.log('### disconnected');
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
        const socketCallback = message => this.emit(key, message, socket);
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
     * @param {Socket} socket - Socket which is emitting
     * @throws Will throw an error if key is not specified
     */
    emit(key, data, socket) {
        // Inner broadcast (same app)
        super.emit(key, data);
        // System broadcast (several devices)
        if (socket) {
            socket.broadcast.emit(key, data);
        } else {
            this.io.emit(key, data);
        }
    }
}
