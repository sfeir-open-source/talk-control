import { EventBus, EventCallback } from '@event-bus/event-bus';
import { eventBusLogger } from '@event-bus/event-bus-logger';
import { Server, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';

export class EventBusWebsocketsServer extends EventBus {
    sockets: Socket[] = [];
    io: Server;

    constructor(server: HttpServer) {
        super();
        this.io = new Server(server, { cors: { origin: '*' } });
        this.io.on('connection', (socket: Socket) => {
            eventBusLogger.log('### connected', {
                id: socket.id,
                from: socket.handshake.headers?.referer ?? 'unknown'
            });
            this.sockets.push(socket);
            for (const key in this.callBacks) {
                this.onMultiple(key, null, socket);
            }
            socket.on('disconnect', () => {
                eventBusLogger.log('### disconnected', {
                    id: socket.id,
                    from: socket.handshake.headers?.referer ?? 'unknown'
                });
                const index = this.sockets.indexOf(socket);
                this.sockets.splice(index, 1);
            });
        });
    }

    onMultiple(key: string, callback: EventCallback | null, socket?: Socket): void {
        if (callback) {
            super.onMultiple(key, callback);
        }
        const socketCallback = (message: unknown) => this.broadcast(key, message, false);
        if (socket) {
            socket.on(key, (...data: unknown[]) => socketCallback(data.find(elem => !!elem) ?? socket));
        } else {
            this.sockets.forEach(s => s.on(key, (...data: unknown[]) => socketCallback(data.find(elem => !!elem) ?? s)));
        }
    }

    on(key: string, callback: EventCallback, socket?: Socket): void {
        try {
            super.on(key, callback);
            this.onMultiple(key, callback, socket);
        } catch (e) {
            eventBusLogger.log('on event bus server error: ', [key, (e as Error).message], true);
        }
    }

    broadcast(key: string, data?: unknown, broadcastToSockets = true): void {
        super.broadcast(key, data);

        if (broadcastToSockets) {
            this.io.emit(key, data);
        }
    }

    emitTo(key: string, data: unknown, socket: Socket): void {
        try {
            super.emitTo(key, data, socket);
        } catch (e) {
            eventBusLogger.log('emitTo error: ', [e], true);
        }

        socket.emit(key, data);
    }
}
