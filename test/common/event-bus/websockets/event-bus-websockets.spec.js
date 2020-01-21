'use strict';

import 'module-alias/register';
import { assert, expect } from 'chai';
import { spy, stub } from 'sinon';
import { SocketEventBus } from '@event-bus/websockets/event-bus-websockets-server';

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

        it('should add key only on given socket', function() {
            // Given
            const socketA = { on: spy() },
                socketB = { on: spy() },
                socketC = { on: spy() };
            const key = 'test';
            eventBus.sockets = [socketA, socketB];
            // When
            eventBus.on(key, null, socketC);
            // Then
            assert(socketA.on.notCalled);
            assert(socketB.on.notCalled);
            assert(socketC.on.calledOnceWith(key));
        });
    });

    describe('emit()', function() {
        it('sould broadcast the data', function() {
            // Given
            stub(eventBus.io, 'emit');
            const key = 'test';
            const message = 'message';
            // When
            eventBus.emit(key, message, false);
            // Then
            assert(eventBus.io.emit.notCalled);
            eventBus.io.emit.restore();
        });
    });
});
