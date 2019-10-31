'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { SocketEventBusClient } from '@event-bus/websockets/event-bus-websockets-client';
import { stub, spy } from 'sinon';
import socketIO from 'socket.io-client';

describe('SocketEventBusClient', function() {
    let eventBus;
    before(function() {
        stub(socketIO, 'connect').returns({ on: spy() });
    });

    beforeEach(function() {
        eventBus = new SocketEventBusClient();
    });

    after(function() {
        socketIO.connect.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated SocketEventBusClient', function() {
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
        it('should broadcast the data', function() {
            // Given
            const key = 'test';
            const data = 'data';
            eventBus.io = { emit: spy() };
            // When
            eventBus.emit(key, data);
            // Then
            assert(eventBus.io.emit.calledOnceWith(data));
        });
    });
});
