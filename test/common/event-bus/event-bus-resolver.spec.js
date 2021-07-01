'use strict';

import 'module-alias/register';
import { expect } from 'chai';
import { assert, createStubInstance, mock, stub } from 'sinon';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { EventBusProxy } from '@event-bus/event-bus-proxy';
import { EventBus } from '@event-bus/event-bus';
import contextService from '@services/context';
import * as wsClientContext from '@event-bus/websockets/event-bus-websockets-client';
import * as wsServerContext from '@event-bus/websockets/event-bus-websockets-server';
import * as postMessageContext from '@event-bus/postmessage/event-bus-postmessage';
import { eventBusLogger } from '@event-bus/event-bus-logger';

describe('EventBusResolver', function() {
    describe('resolve channel', function() {
        let isClientSide;

        before(function() {
            isClientSide = stub(contextService, 'isClientSide');
        });

        after(function() {
            isClientSide.restore();
        });

        it('should return a proxied web socket server based event bus when requesting CONTROLLER-SERVER channel and execution context is server side', function() {
            // Given
            const eventBus = mock({ name: 'EVENT_BUS_WEBSOCKET_SERVER' });
            const constructor = stub(wsServerContext, 'EventBusWebsocketsServer').returns(eventBus);
            isClientSide.returns(false);

            const server = { port: 10 };
            // When
            const result = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
            // Then
            assert.calledWithExactly(constructor, server);
            expect(result instanceof EventBusProxy).to.be.true;
            expect(result.eventBus).to.be.equal(eventBus);
            constructor.restore();
        });

        it('should return a proxied web socket client based event bus when requesting CONTROLLER-SERVER channel and execution context is client side', function() {
            // Given
            const eventBus = mock({ name: 'EVENT_BUS_WEBSOCKET_CLIENT' });
            const constructor = stub(wsClientContext, 'EventBusWebsocketsClient').returns(eventBus);
            isClientSide.returns(true);

            const server = 'http://test.server.com';
            // When
            const result = EventBusResolver.channel(Channels.CONTROLLER_SERVER, { server });
            // Then
            assert.calledWithExactly(constructor, server);
            expect(result instanceof EventBusProxy).to.be.true;
            expect(result.eventBus).to.be.equal(eventBus);
            constructor.restore();
        });

        it('should return a proxied post message based event bus when requesting CONTROLLER-COMPONENT channel and execution context is client side', function() {
            // Given
            const eventBus = mock({ name: 'EVENT_BUS_POST_MESSAGE' });
            const constructor = stub(postMessageContext, 'EventBusPostMessage').returns(eventBus);
            isClientSide.returns(true);

            const deep = true;
            // When
            const result = EventBusResolver.channel(Channels.CONTROLLER_COMPONENT, { deep });
            // Then
            assert.calledWithExactly(constructor, deep);
            expect(result instanceof EventBusProxy).to.be.true;
            expect(result.eventBus).to.be.equal(eventBus);
            constructor.restore();
        });

        it('should raise unknown channel error when requesting CONTROLLER-COMPONENT channel and execution context is server side', function() {
            // Given
            isClientSide.returns(false);
            // When / Then
            expect(() => EventBusResolver.channel(Channels.CONTROLLER_COMPONENT, {})).to.throw(Error, 'Unknown channel');
        });

        it('should raise unknown channel error when requesting unknown channel and execution context is server side', function() {
            // Given
            isClientSide.returns(false);
            // When / Then
            expect(() => EventBusResolver.channel('NOT_EXIST', {})).to.throw(Error, 'Unknown channel');
        });

        it('should raise unknown channel error when requesting unknown channel and execution context is client side', function() {
            // Given
            isClientSide.returns(true);
            // When / Then
            expect(() => EventBusResolver.channel('NOT_EXIST', {})).to.throw(Error, 'Unknown channel');
        });
    });
});

describe('EventBusProxy', function() {
    const channelName = 'CHANNEL_NAME_TEST';
    let proxy, eventBus, log;

    beforeEach(function() {
        log = stub(eventBusLogger, 'log');
        eventBus = createStubInstance(EventBus);
        proxy = new EventBusProxy(channelName, eventBus);
    });

    afterEach(function() {
        log.restore();
    });

    it('should log broadcast with data while delegating event bus', function() {
        // Given
        const key = 'KEY_TEST';
        const data = ['data1', 'data2'];
        // When
        proxy.broadcast(key, data);
        // Then
        assert.calledWithExactly(log, `BROADCAST "${key}" on channel ${channelName} with: ${JSON.stringify(data)}`);
        assert.calledWithExactly(eventBus.broadcast, key, data);
    });

    it('should log broadcast without data while delegating event bus', function() {
        // Given
        const key = 'KEY_TEST';
        // When
        proxy.broadcast(key);
        // Then
        assert.calledWithExactly(log, `BROADCAST "${key}" on channel ${channelName} with: no data`);
        assert.calledWithExactly(eventBus.broadcast, key, undefined);
    });

    it('should log emitTo target with data while delegating event bus', function() {
        // Given
        const key = 'KEY_TEST';
        const data = ['data1', 'data2'];
        const target = { id: 'test_target' };
        // When
        proxy.emitTo(key, data, target);
        // Then
        assert.calledWithExactly(log, `EMIT "${key}" on channel ${channelName} to target "${target.id}" with: ${JSON.stringify(data)}`);
        assert.calledWithExactly(eventBus.emitTo, key, data, target);
    });

    it('should log emitTo target without data while delegating event bus', function() {
        // Given
        const key = 'KEY_TEST';
        const target = { id: 'test_target' };
        // When
        proxy.emitTo(key, null, target);
        // Then
        assert.calledWithExactly(log, `EMIT "${key}" on channel ${channelName} to target "${target.id}" with: no data`);
        assert.calledWithExactly(eventBus.emitTo, key, null, target);
    });

    it('should log onMultiple event while delegating event bus', function() {
        // Given
        const key = 'KEY_TEST';
        const callback = () => 'do something';
        // When
        proxy.onMultiple(key, callback);
        // Then
        assert.calledWithExactly(log, `SET onMultiple event '${key}' on ${channelName}`);
        assert.calledWithExactly(eventBus.onMultiple, key, callback);
    });

    it('should log on event while delegating event bus', function() {
        // Given
        const key = 'KEY_TEST';
        const callback = () => 'do something';
        // When
        proxy.on(key, callback);
        // Then
        assert.calledWithExactly(log, `SET on event '${key}' on ${channelName}`);
        assert.calledWithExactly(eventBus.on, key, callback);
    });
});
