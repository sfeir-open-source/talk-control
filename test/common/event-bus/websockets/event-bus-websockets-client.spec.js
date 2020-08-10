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
        it('should fire events', function() {
            // Given
            const key = 'test';
            // When
            eventBus.on(key, () => key);
            // Then
            assert(eventBus.io.on.calledOnceWith(key));
        });
    });

    describe('broadcast()', function() {
        it('should broadcast through io', function() {
            // Given
            const key = 'test';
            const data = 'data';
            // When
            eventBus.broadcast(key, data);
            // Then
            assert(eventBus.io.emit.calledOnceWith(key, data));
        });
    });
});
