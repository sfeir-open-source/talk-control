import { SocketEventBus } from './event-bus-websockets';
import socketIO from 'socket.io-client';

/**
 * @classdesc SocketClient based EventBus implementation
 * @class
 * @augments SocketEventBus
 */
export class SocketEventBusClient extends SocketEventBus {
    constructor(server) {
        super(server);
        this.io = socketIO.connect(server, { reconnect: true });
        this.io.on('connection', socket => {
            console.log('### connection');
            this.sockets.push(socket);
        });
    }
}
