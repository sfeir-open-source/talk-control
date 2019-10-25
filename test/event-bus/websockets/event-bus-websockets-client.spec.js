import { expect } from 'chai';
import { SocketEventBusClient } from '../../../src/event-bus/websockets/event-bus-websockets-client';
import { stub, spy } from 'sinon';
import socketIO from 'socket.io-client';

describe('SocketEventBusClient', function() {
    describe('constructor()', function() {
        it('should have instantiated SocketEventBusClient', function() {
            stub(socketIO, 'connect').returns({ on: spy() });
            const eventBus = new SocketEventBusClient();
            expect(eventBus).to.be.ok;
        });
    });
});
