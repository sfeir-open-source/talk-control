import socketIO, { Socket } from 'socket.io-client';
import { EventBus, EventCallback } from '../event-bus';
import { eventBusLogger } from '@event-bus/event-bus-logger';

type SocketIOWithConnect = typeof socketIO & { connect: (url?: string) => Socket };

export class EventBusWebsocketsClient extends EventBus {
    io: Socket;

    constructor(server?: string) {
        super();
        // socket.io-client v4 exposes .connect as a callable alias; not reflected in TS types
        this.io = (socketIO as SocketIOWithConnect).connect(server);
    }

    onMultiple(key: string, callback: EventCallback): void {
        super.onMultiple(key, callback);
        this.io.on(key, callback);
    }

    on(key: string, callback: EventCallback): void {
        try {
            super.on(key, callback);
            this.onMultiple(key, callback);
        } catch (e) {
            eventBusLogger.log('on event bus client error: ', [key, (e as Error).message], true);
        }
    }

    broadcast(key: string, data?: unknown): void {
        super.broadcast(key, data);
        this.io.emit(key, data);
    }

    emitTo(key: string, data: unknown, socket: { emit: (key: string, data: unknown) => void }): void {
        super.emitTo(key, data, socket);
        socket.emit(key, data);
    }
}
