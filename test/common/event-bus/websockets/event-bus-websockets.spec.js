'use strict';

import 'module-alias/register';
import { assert, expect } from 'chai';
import { spy } from 'sinon';
import { SocketEventBus } from '@event-bus/websockets/event-bus-websockets';

describe('SocketEventBus', function() {
    let eventBus = new SocketEventBus();
    beforeEach(function() {
        eventBus = new SocketEventBus();
    });

    describe('constructor()', function() {
        it('should have instantiated SocketEventBus', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('on()', function() {
        it('should fire events', function() {
            // Given
            const socketA = { on: spy() },
                socketB = { on: spy() },
                socketC = { on: spy() };
            const key = 'test';
            eventBus.sockets = [socketA, socketB, socketC];
            // When
            eventBus.on(key, () => key);
            // Then
            assert(socketA.on.calledOnceWith(key));
            assert(socketB.on.calledOnceWith(key));
            assert(socketC.on.calledOnceWith(key));
        });
    });

    describe('emit()', function() {
        it('sould broadcast the data', function() {
            // Given
            const socket = { broadcast: { emit: spy() } };
            const key = 'test';
            const message = 'message';
            // When
            eventBus.emit(key, message, socket);
            // Then
            assert(socket.broadcast.emit.calledOnceWith(message));
        });
    });
});
