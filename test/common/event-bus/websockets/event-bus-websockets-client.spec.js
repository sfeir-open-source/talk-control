'use strict';

import { EventBusWebsocketsClient } from '@event-bus/websockets/event-bus-websockets-client';
import socketIO from 'socket.io-client';

describe('EventBusWebsocketsClient', function () {
    let eventBus;

    beforeAll(function () {
        vi.spyOn(socketIO, 'connect').mockReturnValue({ on: vi.fn(), emit: vi.fn() });
    });

    beforeEach(function () {
        eventBus = new EventBusWebsocketsClient();
    });

    afterAll(function () {
        socketIO.connect.mockRestore();
    });

    describe('constructor()', function () {
        it('should have instantiated EventBusWebsocketsClient', function () {
            expect(eventBus).toBeTruthy();
        });
    });

    describe('on()', function () {
        it('should call onMultiple', function () {
            // Given
            const key = 'key';
            const callback = () => 'callback';
            const onMultipleSpy = vi.spyOn(eventBus, 'onMultiple').mockImplementation(() => {});
            // When
            eventBus.on(key, callback);
            // Then
            expect(onMultipleSpy).toHaveBeenCalledWith(key, callback);
            onMultipleSpy.mockRestore();
        });

        it('should not throw when duplicate key triggers error (error path)', function () {
            // Given
            const key = 'duplicateKey';
            const callback = () => 'callback';
            // Register the key once
            eventBus.on(key, callback);
            // When - registering the same key again should throw internally but be caught
            expect(() => {
                eventBus.on(key, () => 'second callback');
            }).not.toThrow();
        });
    });

    describe('onMultiple()', function () {
        it('should fire events', function () {
            // Given
            const key = 'key';
            // When
            eventBus.on(key, () => key);
            // Then
            expect(eventBus.io.on).toHaveBeenCalledWith(key, expect.any(Function));
        });
    });

    describe('broadcast()', function () {
        it('should broadcast through io', function () {
            // Given
            const key = 'key';
            const data = 'data';
            // When
            eventBus.broadcast(key, data);
            // Then
            expect(eventBus.io.emit).toHaveBeenCalledExactlyOnceWith(key, data);
        });
    });

    describe('emitTo()', function () {
        it('should emit the data', function () {
            // Given
            const socket = {
                emit: () => {}
            };
            const emitSpy = vi.spyOn(socket, 'emit').mockImplementation(() => {});
            const key = 'key';
            const data = 'data';
            // When
            eventBus.emitTo(key, data, socket);
            // Then
            expect(emitSpy).toHaveBeenCalledWith(key, data);
            emitSpy.mockRestore();
        });
    });
});
