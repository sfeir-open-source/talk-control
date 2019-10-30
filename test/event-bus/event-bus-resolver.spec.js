import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { EventBusResolver } from '../../src/event-bus/event-bus-resolver';
import { SocketEventBusClient } from '../../src/event-bus/websockets/event-bus-websockets-client';
import socketIOClient from 'socket.io-client';

describe('EventBusResolver', function() {
    describe('constructor()', function() {
        let resolver;

        before(function() {
            stub(socketIOClient, 'connect').returns({ on: spy() });
        });

        afterEach(function() {
            resolver = undefined;
        });

        after(function() {
            socketIOClient.connect.restore();
        });

        // ! Could not implement because no server to connect to
        // ! Throws 'TypeError: server.listeners is not a function'
        // it('shoud instantiate a SocketServer', function() {
        //     // When
        //     resolver = new EventBusResolver({ server: 'http://localhost:3000' });
        //     // Then
        //     expect(resolver.socketBus instanceof SocketEventBus).to.be.true;
        // });

        it('shoud instantiate a SocketClient', function() {
            // When
            resolver = new EventBusResolver({ server: 'http://localhost:3000', client: true });
            // Then
            expect(resolver.socketBus instanceof SocketEventBusClient).to.be.true;
        });

        it('shoud instantiate a Postmessage', function() {
            // Given
            // global.window = { addEventListener: () => undefined, postMessage: spy() };
            stub(window, 'addEventListener');
            spy(window, 'postMessage');
            // When
            resolver = new EventBusResolver({});
            // Then
            expect(resolver.postMessageBus).to.be.ok;

            window.addEventListener.restore();
            window.postMessage.restore();
        });
    });
});
