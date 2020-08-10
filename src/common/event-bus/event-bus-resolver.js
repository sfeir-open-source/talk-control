'use strict';

import { EventBusWebsocketsServer } from './websockets/event-bus-websockets-server.js';
import { EventBusWebsocketsClient } from './websockets/event-bus-websockets-client.js';
import { EventBusPostMessage } from './postmessage/event-bus-postmessage.js';
import { eventBusLogger } from './event-bus-logger';

export const MASTER_SERVER_CHANNEL = 'MASTER_SERVER_CHANNEL';
export const CONTROLLER_COMPONENT_CHANNEL = 'CONTROLLER_COMPONENT_CHANNEL';

export const UNKNOWN_CHANNEL = 'Unknown channel';

/**
 * @classdesc Instantiate event buses based on params given
 * @class EventBusResolver
 */
export class EventBusResolver {
    constructor(params) {
        this.channels = {};

        if (params.server) {
            if (params.client) {
                // Master
                this.channels[MASTER_SERVER_CHANNEL] = new EventBusWebsocketsClient(params.server);
            } else {
                // Server
                this.channels[MASTER_SERVER_CHANNEL] = new EventBusWebsocketsServer(params.server);
            }
        }

        if (typeof window != 'undefined') {
            // Slave
            this.channels[CONTROLLER_COMPONENT_CHANNEL] = new EventBusPostMessage(params.postMessage || {});
        }
    }

    /**
     *
     * @param {MASTER_SERVER_CHANNEL | CONTROLLER_COMPONENT_CHANNEL} channel - Channel on which to broadcast
     * @param {string} key - Event key to fire
     * @param {*} data - Data to broadcast
     * @throws Will throw an error if key is not specified or if dest is incorrect
     */
    broadcast(channel, key, data) {
        if (![MASTER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL].includes(channel)) {
            throw new Error(UNKNOWN_CHANNEL);
        }
        
        eventBusLogger.log(`BROADCAST "${key}" on channel ${channel} with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.channels[channel].broadcast(key, data);
    }

    /**
     * Emit data for the target passed in parameter on given event key
     *
     * @param {MASTER_SERVER_CHANNEL | CONTROLLER_COMPONENT_CHANNEL} channel - Channel on which to emit
     * @param {string} key - Event name
     * @param {any} data - Values
     * @param {any} target - Socket or window to which the event will be sent
     */
    emitTo(channel, key, data, target) {
        if (![MASTER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL].includes(channel)) {
            throw new Error(UNKNOWN_CHANNEL);
        }

        eventBusLogger.log(`EMIT "${key}" on channel ${channel} to target "${target.id}" with: ${data ? JSON.stringify(data) : 'no data'}`);
        this.channels[channel].emitTo(key, data, target);
    }

    /**
     *
     * @param {MASTER_SERVER_CHANNEL | CONTROLLER_COMPONENT_CHANNEL} channel - Channel from which to listen
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    onMultiple(channel, key, callback) {
        if (![MASTER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL].includes(channel)) {
            throw new Error(UNKNOWN_CHANNEL);
        }

        eventBusLogger.log(`SET onMultiple '${key}' on ${channel}`);
        this.channels[channel].onMultiple(key, callback);
    }
    
    /**
     *
     * @param {MASTER_SERVER_CHANNEL | CONTROLLER_COMPONENT_CHANNEL} channel - Channel from which to listen
     * @param {string} key - Event key to listen
     * @param {*} callback - Function to call when the event is fired
     * @throws Will throw an error if key is not specified or if src is incorrect
     */
    on(channel, key, callback) {
        if (![MASTER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL].includes(channel)) {
            throw new Error(UNKNOWN_CHANNEL);
        }

        try {
            this.channels[channel].on(key, callback);
        } catch (e) {
            eventBusLogger.log('on event bus resolver error: ', [key, e.message], true);
        }
    }
}
