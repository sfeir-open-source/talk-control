'use strict';

import { EventBusWebsocketsServer } from './websockets/event-bus-websockets-server.js';
import { EventBusWebsocketsClient } from './websockets/event-bus-websockets-client.js';
import { EventBusPostMessage } from './postmessage/event-bus-postmessage.js';
import { eventBusLogger } from './event-bus-logger';
import { EventBus } from '@event-bus/event-bus';
import contextService from '@services/context';

/**
 * Type of channels
 *
 * @enum {string}
 */
export const Channels = {
    CONTROLLER_SERVER: 'CONTROLLER_SERVER',
    CONTROLLER_COMPONENT: 'CONTROLLER_COMPONENT'
};

/**
 * @class EventBusResolver
 * @classdesc Resolve and instantiate event buses
 */
export class EventBusResolver {
    /**
     * @param {Channels} name - Channel name to resolve
     * @param {*} options - Channel options
     * @returns {EventBus} Resolved event bus
     */
    static channel(name, options = {}) {
        if (!contextService.isClientSide()) {
            switch (name) {
                case Channels.CONTROLLER_SERVER:
                    return new EventBusProxy(Channels.CONTROLLER_SERVER, new EventBusWebsocketsServer(options.server));
                default:
                    throw new Error('Unknown channel');
            }
        } else {
            switch (name) {
                case Channels.CONTROLLER_SERVER:
                    return new EventBusProxy(Channels.CONTROLLER_SERVER, new EventBusWebsocketsClient(options.server));
                case Channels.CONTROLLER_COMPONENT:
                    return new EventBusProxy(Channels.CONTROLLER_COMPONENT, new EventBusPostMessage(options.deep));
                default:
                    throw new Error('Unknown channel');
            }
        }
    }
}

/**
 * @class EventBusProxy
 * @classdesc Proxy event bus by name and logs events
 */
export class EventBusProxy extends EventBus {
    /**
     * @param {Channels} name - Event bus channel name
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
