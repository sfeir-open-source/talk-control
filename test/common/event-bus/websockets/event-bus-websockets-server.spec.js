'use strict';

import 'module-alias/register';
import { assert, expect } from 'chai';
import { spy, stub } from 'sinon';
import { EventBusWebsocketsServer } from '@event-bus/websockets/event-bus-websockets-server';

describe('EventBusWebsocketsServer', function () {
    let eventBus = new EventBusWebsocketsServer();

    beforeEach(function () {
        eventBus = new EventBusWebsocketsServer();
    });

    describe('constructor()', function () {
        it('should have instantiated EventBusWebsocketsServer', function () {
            expect(eventBus).to.be.ok;
        });

        it('should add socket to sockets array on connection', function () {
            // Given
            const mockSocket = {
                id: 'socket-1',
                handshake: { headers: { referer: 'http://test' } },
                on: spy()
            };
            // Get the connection listener registered in the constructor
            const connectionListeners = eventBus.io.listeners('connection');
            expect(connectionListeners.length).to.be.greaterThan(0);
            const connectionCallback = connectionListeners[0];
            // When
            connectionCallback(mockSocket);
            // Then
            assert.include(eventBus.sockets, mockSocket);
        });

        it('should remove socket from sockets array on disconnect', function () {
            // Given
            let disconnectCallback;
            const mockSocket = {
                id: 'socket-1',
                handshake: { headers: {} },
                on: (event, cb) => {
                    if (event === 'disconnect') disconnectCallback = cb;
                }
            };
            const connectionListeners = eventBus.io.listeners('connection');
            const connectionCallback = connectionListeners[0];
            connectionCallback(mockSocket);
            assert.include(eventBus.sockets, mockSocket, 'socket should be added first');
            // When
            disconnectCallback();
            // Then
            assert.notInclude(eventBus.sockets, mockSocket, 'socket should be removed after disconnect');
        });

        it('should subscribe new socket on existing keys', function () {
            // Given
            const onMultipleSpy = spy(eventBus, 'onMultiple');
            eventBus.callBacks['existingKey'] = [() => {}];
            const mockSocket = {
                id: 'socket-2',
                handshake: { headers: {} },
                on: spy()
            };
            const connectionListeners = eventBus.io.listeners('connection');
            const connectionCallback = connectionListeners[0];
            // When
            connectionCallback(mockSocket);
            // Then
            assert.isOk(onMultipleSpy.calledWith('existingKey', null, mockSocket));
            onMultipleSpy.restore();
        });
    });

    describe('on()', function () {
        it('should call onMultiple', function () {
            // Given
            const key = 'key';
            const callback = () => 'callback';
            const socket = 'socket';
            stub(eventBus, 'onMultiple');
            // When
            eventBus.on(key, callback, socket);
            // Then
            assert.isOk(eventBus.onMultiple.calledWith(key, callback, socket));
        });

        it('should not throw when super.on throws (duplicate key error path)', function () {
            // Given
            const key = 'key';
            const callback = () => 'callback';
            // Register the key once
            eventBus.on(key, callback);
            // When - calling on() a second time with the same key should trigger the duplicate error
            // but it should be caught internally and not propagate
            assert.doesNotThrow(() => {
                eventBus.on(key, () => 'second callback');
            });
        });
    });

    describe('onMultiple()', function () {
        it('should fire events', function () {
            // Given
            const socketA = { on: spy() },
                socketB = { on: spy() },
                socketC = { on: spy() };
            const key = 'key';
            eventBus.sockets = [socketA, socketB, socketC];
            // When
            eventBus.on(key, () => key);
            // Then
            assert(socketA.on.calledOnceWith(key));
            assert(socketB.on.calledOnceWith(key));
            assert(socketC.on.calledOnceWith(key));
        });

        it('should add key only on given socket', function () {
            // Given
            const socketA = { on: spy() },
                socketB = { on: spy() },
                socketC = { on: spy() };
            const key = 'key';
            eventBus.sockets = [socketA, socketB];
            // When
            eventBus.on(key, null, socketC);
            // Then
            assert(socketA.on.notCalled);
            assert(socketB.on.notCalled);
            assert(socketC.on.calledOnceWith(key));
        });
    });

    describe('broadcast()', function () {
        it('should broadcast the data', function () {
            // Given
            stub(eventBus.io, 'emit');
            const key = 'key';
            const message = 'message';
            // When
            eventBus.broadcast(key, message, false);
            // Then
            assert(eventBus.io.emit.notCalled);
            eventBus.io.emit.restore();
        });

        it('should call io.emit when broadcast=true', function () {
            // Given
            stub(eventBus.io, 'emit');
            const key = 'key';
            const message = 'message';
            // When
            eventBus.broadcast(key, message, true);
            // Then
            assert.isOk(eventBus.io.emit.calledOnceWith(key, message));
            eventBus.io.emit.restore();
        });

        it('should call io.emit by default (no broadcast param)', function () {
            // Given
            stub(eventBus.io, 'emit');
            const key = 'key';
            const message = 'message';
            // When
            eventBus.broadcast(key, message);
            // Then
            assert.isOk(eventBus.io.emit.calledOnceWith(key, message));
            eventBus.io.emit.restore();
        });
    });

    describe('emitTo()', function () {
        it('should emit the data', function () {
            // Given
            const socket = {
                emit: () => {}
            };
            stub(socket, 'emit');
            const key = 'key';
            const data = 'data';
            // When
            eventBus.emitTo(key, data, socket);
            // Then
            assert.isOk(socket.emit.calledWith(key, data));
            socket.emit.restore();
        });
    });
});
