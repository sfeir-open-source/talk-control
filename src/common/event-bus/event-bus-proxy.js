import { EventBus } from './event-bus';
import { eventBusLogger } from './event-bus-logger';

/**
 * @class EventBusProxy
 * @classdesc Proxy event bus by name and logs events
 */
export class EventBusProxy extends EventBus {
    /**
     * @param {string} name - Event bus channel name
     * @param {EventBus} eventBus - Proxied event bus
     */
    constructor(name, eventBus) {
        super();
        this.name = name;
        this.eventBus = eventBus;
    }

    /**
     * @override
     * @param {string} key - Event key to fire
     * @param {*} data - Data to broadcast
     * @throws Will throw an error if key is not specified or if dest is incorrect
     */
    broadcast(key, data) {
        eventBusLogger.log(`BROADCAST "${key}" on channel ${this.name} with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.eventBus.broadcast(key, data);
    }

    /**
     * @override
     * @param {string} key - Event name
     * @param {any} data - Values
     * @param {any} target - Socket or window to which the event will be sent
     */
    emitTo(key, data, target) {
        eventBusLogger.log(`EMIT "${key}" on channel ${this.name} to target "${target.id}" with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.eventBus.emitTo(key, data, target);
    }

    /**
     * @override
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    onMultiple(key, callback) {
        eventBusLogger.log(`SET onMultiple event '${key}' on ${this.name}`);
        this.eventBus.onMultiple(key, callback);
    }

    /**
     * @override
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    on(key, callback) {
        try {
            eventBusLogger.log(`SET on event '${key}' on ${this.name}`);
            this.eventBus.on(key, callback);
        } catch (e) {
            eventBusLogger.log('on event bus resolver error: ', [key, e.message], true);
        }
    }
}
