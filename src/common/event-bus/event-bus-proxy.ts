import { EventBus, EventCallback } from './event-bus';
import { eventBusLogger } from './event-bus-logger';

export class EventBusProxy extends EventBus {
    name: string;
    eventBus: EventBus;

    constructor(name: string, eventBus: EventBus) {
        super();
        this.name = name;
        this.eventBus = eventBus;
    }

    broadcast(key: string, data?: unknown): void {
        eventBusLogger.log(`BROADCAST "${key}" on channel ${this.name} with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.eventBus.broadcast(key, data);
    }

    emitTo(key: string, data: unknown, target: unknown): void {
        const targetId = (target as { id?: string })?.id ?? 'unknown';
        eventBusLogger.log(`EMIT "${key}" on channel ${this.name} to target "${targetId}" with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.eventBus.emitTo(key, data, target);
    }

    onMultiple(key: string, callback: EventCallback): void {
        eventBusLogger.log(`SET onMultiple event '${key}' on ${this.name}`);
        this.eventBus.onMultiple(key, callback);
    }

    on(key: string, callback: EventCallback): void {
        try {
            eventBusLogger.log(`SET on event '${key}' on ${this.name}`);
            this.eventBus.on(key, callback);
        } catch (e) {
            eventBusLogger.log('on event bus resolver error: ', [key, (e as Error).message], true);
        }
    }
}
