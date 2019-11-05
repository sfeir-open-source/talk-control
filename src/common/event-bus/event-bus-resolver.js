'use strict';

import { SocketEventBus } from './websockets/event-bus-websockets';
import { SocketEventBusClient } from './websockets/event-bus-websockets-client';
import { PostMessageEventBus } from './postmessage/event-bus-postmessage';

/**
 * @classdesc Instantiate event buses based on params given
 * @class
 */
export class EventBusResolver {
    constructor(params) {
        if (params.server) {
            if (params.client) {
                this.socketBus = new SocketEventBusClient(params.server);
            } else {
                this.socketBus = new SocketEventBus(params.server);
            }
        }

        if (typeof window != 'undefined') {
            this.postMessageBus = new PostMessageEventBus();
        }
    }
}
