'use strict';

import { EventBusWebsocketsServer } from './websockets/event-bus-websockets-server.js';
import { EventBusWebsocketsClient } from './websockets/event-bus-websockets-client.js';
import { EventBusPostMessage } from './postmessage/event-bus-postmessage.js';
import { eventBusLogger } from './event-bus-logger';
import { EventBus } from '@event-bus/event-bus';

export const CONTROLLER_SERVER_CHANNEL = 'CONTROLLER_SERVER_CHANNEL';
export const CONTROLLER_COMPONENT_CHANNEL = 'CONTROLLER_COMPONENT_CHANNEL';

export const UNKNOWN_CHANNEL = 'Unknown channel';

/**
 * @classdesc Resolve and instantiate event buses
 * @class EventBusResolver
 */
export class EventBusResolver {
    /**
     * @param {CONTROLLER_SERVER_CHANNEL | CONTROLLER_COMPONENT_CHANNEL} name - Channel name to resolve
     * @param {*} options - Channel options
     * @returns {EventBus}
     */
    static channel(name, options = {}) {
        const serverSide = typeof window == 'undefined';

        if (serverSide) {
            switch (name) {
                case CONTROLLER_SERVER_CHANNEL:
                    return new EventBusProxy(CONTROLLER_SERVER_CHANNEL, new EventBusWebsocketsServer(options.server));
                default:
                    throw new Error(UNKNOWN_CHANNEL);
            }
        } else {
            switch (name) {
                case CONTROLLER_SERVER_CHANNEL:
                    return new EventBusProxy(CONTROLLER_SERVER_CHANNEL, new EventBusWebsocketsClient(options.server));
                case CONTROLLER_COMPONENT_CHANNEL:
                    return new EventBusProxy(CONTROLLER_COMPONENT_CHANNEL, new EventBusPostMessage(options.deep));
                default:
                    throw new Error(UNKNOWN_CHANNEL);
            }
        }
    }
}

class EventBusProxy extends EventBus {
    constructor(name, eventBus) {
        super();
        this.name = name;
        this.eventBus = eventBus;
    }

    /**
     *
     * @param {string} key - Event key to fire
     * @param {*} data - Data to broadcast
     * @throws Will throw an error if key is not specified or if dest is incorrect
     */
    broadcast(key, data) {
        eventBusLogger.log(`BROADCAST "${key}" on channel ${this.name} with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.eventBus.broadcast(key, data);
    }

    /**
     * Emit data for the target passed in parameter on given event key
     *
     * @param {string} key - Event name
     * @param {any} data - Values
     * @param {any} target - Socket or window to which the event will be sent
     */
    emitTo(key, data, target) {
        eventBusLogger.log(`EMIT "${key}" on channel ${this.name} to target "${target.id}" with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.eventBus.emitTo(key, data, target);
    }

    /**
     *
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    onMultiple(key, callback) {
        eventBusLogger.log(`SET onMultiple '${key}' on ${this.name}`);
        this.eventBus.onMultiple(key, callback);
    }

    /**
     *
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    on(key, callback) {
        try {
            this.eventBus.on(key, callback);
        } catch (e) {
            eventBusLogger.log('on event bus resolver error: ', [key, e.message], true);
        }
    }
}
