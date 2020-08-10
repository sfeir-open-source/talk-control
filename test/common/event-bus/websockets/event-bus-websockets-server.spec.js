'use strict';

import 'module-alias/register';
import { assert, expect } from 'chai';
import { spy, stub } from 'sinon';
import { EventBusWebsocketsServer } from '@event-bus/websockets/event-bus-websockets-server';

describe('EventBusWebsocketsServer', function() {
    let eventBus = new EventBusWebsocketsServer();
    beforeEach(function() {
        eventBus = new EventBusWebsocketsServer();
    });

    describe('constructor()', function() {
        it('should have instantiated EventBusWebsocketsServer', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('on()', function() {
        it('should call onMultiple', function() {
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
    });

    describe('onMultiple()', function() {
        it('should fire events', function() {
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

        it('should add key only on given socket', function() {
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

    describe('broadcast()', function() {
        it('should broadcast the data', function() {
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
    });

    describe('emitTo()', function() {
        it('should emit the data', function() {
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
