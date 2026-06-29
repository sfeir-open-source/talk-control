import { EventBusWebsocketsServer } from './websockets/event-bus-websockets-server.js';
import { EventBusWebsocketsClient } from './websockets/event-bus-websockets-client.js';
import { EventBusPostMessage } from './postmessage/event-bus-postmessage.js';
import { EventBus } from '@event-bus/event-bus';
import { EventBusProxy } from '@event-bus/event-bus-proxy';
import contextService from '@services/context';
import type { Server as HttpServer } from 'http';

export const Channels = {
    CONTROLLER_SERVER: 'CONTROLLER_SERVER',
    CONTROLLER_COMPONENT: 'CONTROLLER_COMPONENT'
} as const;

export type Channel = (typeof Channels)[keyof typeof Channels];

interface ChannelOptions {
    server?: HttpServer | string;
    deep?: boolean;
}

export class EventBusResolver {
    static channel(name: Channel, options: ChannelOptions = {}): EventBus {
        if (!contextService.isClientSide()) {
            switch (name) {
                case Channels.CONTROLLER_SERVER:
                    return new EventBusProxy(Channels.CONTROLLER_SERVER, new EventBusWebsocketsServer(options.server as HttpServer));
                default:
                    throw new Error('Unknown channel');
            }
        } else {
            switch (name) {
                case Channels.CONTROLLER_SERVER:
                    return new EventBusProxy(Channels.CONTROLLER_SERVER, new EventBusWebsocketsClient(options.server as unknown as string));
                case Channels.CONTROLLER_COMPONENT:
                    return new EventBusProxy(Channels.CONTROLLER_COMPONENT, new EventBusPostMessage(options.deep));
                default:
                    throw new Error('Unknown channel');
            }
        }
    }
}
