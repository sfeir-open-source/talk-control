import { EventBus } from '@event-bus/event-bus.js';
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
        });
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
        this.sockets.forEach(socket => {
            socket.on(key, message => {
                this.emit(key, message, socket);
            });
        });
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
            socket.broadcast.emit(data);
        }
    }
}
