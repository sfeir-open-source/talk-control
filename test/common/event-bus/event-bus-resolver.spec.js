'use strict';

import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { EventBusProxy } from '@event-bus/event-bus-proxy';
import { EventBus } from '@event-bus/event-bus';
import contextService from '@services/context';
import { EventBusWebsocketsServer } from '@event-bus/websockets/event-bus-websockets-server';
import { EventBusWebsocketsClient } from '@event-bus/websockets/event-bus-websockets-client';
import { EventBusPostMessage } from '@event-bus/postmessage/event-bus-postmessage';
import { eventBusLogger } from '@event-bus/event-bus-logger';
import { createStubInstance } from '../../helpers/test-utils.js';

vi.mock('@event-bus/websockets/event-bus-websockets-server');
vi.mock('@event-bus/websockets/event-bus-websockets-client');
vi.mock('@event-bus/postmessage/event-bus-postmessage');

describe('EventBusResolver', function () {
    describe('resolve channel', function () {
        let isClientSide;

        beforeAll(function () {
            isClientSide = vi.spyOn(contextService, 'isClientSide').mockImplementation(() => {});
        });

        afterAll(function () {
            isClientSide.mockRestore();
        });

        it('should return a proxied web socket server based event bus when requesting CONTROLLER-SERVER channel and execution context is server side', function () {
            // Given
            const eventBus = { name: 'EVENT_BUS_WEBSOCKET_SERVER' };
            vi.mocked(EventBusWebsocketsServer).mockImplementation(
                class {
                    constructor() {
                        return eventBus;
                    }
                }
            );
            isClientSide.mockReturnValue(false);

            const server = { port: 10 };
            // When
            const result = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
            // Then
            expect(EventBusWebsocketsServer).toHaveBeenCalledWith(server);
            expect(result).toBeInstanceOf(EventBusProxy);
            expect(result.eventBus).toBe(eventBus);
            vi.mocked(EventBusWebsocketsServer).mockReset();
        });

        it('should return a proxied web socket client based event bus when requesting CONTROLLER-SERVER channel and execution context is client side', function () {
            // Given
            const eventBus = { name: 'EVENT_BUS_WEBSOCKET_CLIENT' };
            vi.mocked(EventBusWebsocketsClient).mockImplementation(
                class {
                    constructor() {
                        return eventBus;
                    }
                }
            );
            isClientSide.mockReturnValue(true);

            const server = 'http://test.server.com';
            // When
            const result = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
            // Then
            expect(EventBusWebsocketsClient).toHaveBeenCalledWith(server);
            expect(result).toBeInstanceOf(EventBusProxy);
            expect(result.eventBus).toBe(eventBus);
            vi.mocked(EventBusWebsocketsClient).mockReset();
        });

        it('should return a proxied post message based event bus when requesting CONTROLLER-COMPONENT channel and execution context is client side', function () {
            // Given
            const eventBus = { name: 'EVENT_BUS_POST_MESSAGE' };
            vi.mocked(EventBusPostMessage).mockImplementation(
                class {
                    constructor() {
                        return eventBus;
                    }
                }
            );
            isClientSide.mockReturnValue(true);

            const deep = true;
            // When
            const result = EventBusResolver.channel(Channels.CONTROLLER_COMPONENT, { deep });
            // Then
            expect(EventBusPostMessage).toHaveBeenCalledWith(deep);
            expect(result).toBeInstanceOf(EventBusProxy);
            expect(result.eventBus).toBe(eventBus);
            vi.mocked(EventBusPostMessage).mockReset();
        });

        it('should raise unknown channel error when requesting CONTROLLER-COMPONENT channel and execution context is server side', function () {
            // Given
            isClientSide.mockReturnValue(false);
            // When / Then
            expect(() => EventBusResolver.channel(Channels.CONTROLLER_COMPONENT, {})).toThrow('Unknown channel');
        });

        it('should raise unknown channel error when requesting unknown channel and execution context is server side', function () {
            // Given
            isClientSide.mockReturnValue(false);
            // When / Then
            expect(() => EventBusResolver.channel('NOT_EXIST', {})).toThrow('Unknown channel');
        });

        it('should raise unknown channel error when requesting unknown channel and execution context is client side', function () {
            // Given
            isClientSide.mockReturnValue(true);
            // When / Then
            expect(() => EventBusResolver.channel('NOT_EXIST', {})).toThrow('Unknown channel');
        });
    });
});

describe('EventBusProxy', function () {
    const channelName = 'CHANNEL_NAME_TEST';
    let proxy, eventBus, log;

    beforeEach(function () {
        log = vi.spyOn(eventBusLogger, 'log').mockImplementation(() => {});
        eventBus = createStubInstance(EventBus);
        proxy = new EventBusProxy(channelName, eventBus);
    });

    afterEach(function () {
        log.mockRestore();
    });

    it('should log broadcast with data while delegating event bus', function () {
        // Given
        const key = 'KEY_TEST';
        const data = ['data1', 'data2'];
        // When
        proxy.broadcast(key, data);
        // Then
        expect(log).toHaveBeenCalledWith(`BROADCAST "${key}" on channel ${channelName} with: ${JSON.stringify(data)}`);
        expect(eventBus.broadcast).toHaveBeenCalledWith(key, data);
    });

    it('should log broadcast without data while delegating event bus', function () {
        // Given
        const key = 'KEY_TEST';
        // When
        proxy.broadcast(key);
        // Then
        expect(log).toHaveBeenCalledWith(`BROADCAST "${key}" on channel ${channelName} with: no data`);
        expect(eventBus.broadcast).toHaveBeenCalledWith(key, undefined);
    });

    it('should log emitTo target with data while delegating event bus', function () {
        // Given
        const key = 'KEY_TEST';
        const data = ['data1', 'data2'];
        const target = { id: 'test_target' };
        // When
        proxy.emitTo(key, data, target);
        // Then
        expect(log).toHaveBeenCalledWith(`EMIT "${key}" on channel ${channelName} to target "${target.id}" with: ${JSON.stringify(data)}`);
        expect(eventBus.emitTo).toHaveBeenCalledWith(key, data, target);
    });

    it('should log emitTo target without data while delegating event bus', function () {
        // Given
        const key = 'KEY_TEST';
        const target = { id: 'test_target' };
        // When
        proxy.emitTo(key, null, target);
        // Then
        expect(log).toHaveBeenCalledWith(`EMIT "${key}" on channel ${channelName} to target "${target.id}" with: no data`);
        expect(eventBus.emitTo).toHaveBeenCalledWith(key, null, target);
    });

    it('should log onMultiple event while delegating event bus', function () {
        // Given
        const key = 'KEY_TEST';
        const callback = () => 'do something';
        // When
        proxy.onMultiple(key, callback);
        // Then
        expect(log).toHaveBeenCalledWith(`SET onMultiple event '${key}' on ${channelName}`);
        expect(eventBus.onMultiple).toHaveBeenCalledWith(key, callback);
    });

    it('should log on event while delegating event bus', function () {
        // Given
        const key = 'KEY_TEST';
        const callback = () => 'do something';
        // When
        proxy.on(key, callback);
        // Then
        expect(log).toHaveBeenCalledWith(`SET on event '${key}' on ${channelName}`);
        expect(eventBus.on).toHaveBeenCalledWith(key, callback);
    });
});
