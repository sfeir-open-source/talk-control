'use strict';

import { EventBusWebsocketsServer } from './websockets/event-bus-websockets-server.js';
import { EventBusWebsocketsClient } from './websockets/event-bus-websockets-client.js';
import { EventBusPostMessage } from './postmessage/event-bus-postmessage.js';
import { EventBus } from '@event-bus/event-bus';
import { EventBusProxy } from '@event-bus/event-bus-proxy';
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
