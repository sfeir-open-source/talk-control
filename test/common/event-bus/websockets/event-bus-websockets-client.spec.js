'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { EventBusWebsocketsClient } from '@event-bus/websockets/event-bus-websockets-client';
import { stub } from 'sinon';
import socketIO from 'socket.io-client';

describe('EventBusWebsocketsClient', function() {
    let eventBus;
    before(function() {
        stub(socketIO, 'connect').returns({ on: stub(), emit: stub() });
    });

    beforeEach(function() {
        eventBus = new EventBusWebsocketsClient();
    });

    after(function() {
        socketIO.connect.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated EventBusWebsocketsClient', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('on()', function() {
        it('should call onMultiple', function() {
            // Given
            const key = 'key';
            const callback = () => 'callback';
            stub(eventBus, 'onMultiple');
            // When
            eventBus.on(key, callback);
            // Then
            assert.isOk(eventBus.onMultiple.calledWith(key, callback));
        });
    });

    describe('onMultiple()', function() {
        it('should fire events', function() {
            // Given
            const key = 'key';
            // When
            eventBus.on(key, () => key);
            // Then
            assert.isOk(eventBus.io.on.calledWith(key));
        });
    });

    describe('broadcast()', function() {
        it('should broadcast through io', function() {
            // Given
            const key = 'key';
            const data = 'data';
            // When
            eventBus.broadcast(key, data);
            // Then
            assert(eventBus.io.emit.calledOnceWith(key, data));
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
