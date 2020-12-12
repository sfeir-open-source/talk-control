'use strict';
//
// import 'module-alias/register';
// import { expect } from 'chai';
// import { stub, spy } from 'sinon';
// import { EventBusResolver, CONTROLLER_SERVER_CHANNEL, CONTROLLER_COMPONENT_CHANNEL, UNKNOWN_CHANNEL } from '@event-bus/event-bus-resolver';
// import { EventBusWebsocketsClient } from '@event-bus/websockets/event-bus-websockets-client';
// import socketIOClient from 'socket.io-client';
// import config from '@config/config.json';

// describe('EventBusResolver', function() {
//     describe('constructor()', function() {
//         before(function() {
//             stub(socketIOClient, 'connect').returns({ on: spy() });
//         });
//
//         after(function() {
//             socketIOClient.connect.restore();
//         });
//
//         // ! Could not implement because no server to connect to
//         // ! Throws 'TypeError: server.listeners is not a function'
//         // it('shoud instantiate a SocketServer', function() {
//         //     // When
//         //     resolver = new EventBusResolver({ server: config.tcServer.urls.local });
//         //     // Then
//         //     expect(resolver.socketBus instanceof EventBusWebsocketsServer).to.be.true;
//         // });
//
//         it('shoud instantiate a SocketClient', function() {
//             // When
//             const resolver = new EventBusResolver({ server: config.tcServer.urls.local, client: true });
//             // Then
//             expect(resolver.channels[CONTROLLER_SERVER_CHANNEL] instanceof EventBusWebsocketsClient).to.be.true;
//         });
//
//         it('shoud instantiate a Postmessage', function() {
//             // Given
//             // global.window = { addEventListener: () => undefined, postMessage: spy() };
//             stub(window, 'addEventListener');
//             stub(window, 'postMessage');
//             // When
//             const resolver = new EventBusResolver({});
//             // Then
//             expect(resolver.channels[CONTROLLER_COMPONENT_CHANNEL]).to.be.ok;
//
//             window.addEventListener.restore();
//             window.postMessage.restore();
//         });
//     });
//
//     describe('broadcast()', function() {
//         it('should throw an error if channel is unknown', function() {
//             const resolver = new EventBusResolver({});
//             expect(() => resolver.broadcast('channel', 'key', 'data')).to.throw(UNKNOWN_CHANNEL);
//         });
//     });
//
//     describe('emitTo()', function() {
//         it('should throw an error if channel is unknown', function() {
//             const resolver = new EventBusResolver({});
//             expect(() => resolver.emitTo('channel', 'key', 'data')).to.throw(UNKNOWN_CHANNEL);
//         });
//     });
//
//     describe('on()', function() {
//         it('should throw an error if channel is unknown', function() {
//             const resolver = new EventBusResolver({});
//             expect(() => resolver.on('channel', 'key', () => 'callback')).to.throw(UNKNOWN_CHANNEL);
//         });
//     });
//
//     describe('onMultiple()', function() {
//         it('should throw an error if channel is unknown', function() {
//             const resolver = new EventBusResolver({});
//             expect(() => resolver.on('channel', 'key', () => 'callback')).to.throw(UNKNOWN_CHANNEL);
//         });
//     });
// });
