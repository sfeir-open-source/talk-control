'use strict';

import 'module-alias/register';
import { expect, assert } from 'chai';
import { spy, stub } from 'sinon';
import { EventBusPostMessage } from '@event-bus/postmessage/event-bus-postmessage';

describe('EventBusPostMessage', function() {
    let eventBus;
    beforeEach(function() {
        stub(window, 'addEventListener');
        spy(window, 'postMessage');
        eventBus = new EventBusPostMessage({ postMessage: {} });
    });

    afterEach(function() {
        window.addEventListener.restore();
        window.postMessage.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated EventBusWebsocketsServer', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('broadcast()', function() {
        it('should call window.postMessage', function() {
            // Given
            const key = 'key';
            const data = 'data';
            eventBus.windows = [window];
            // When
            eventBus.broadcast(key, data);
            // Then
            const object = { type: key, data };
            assert(window.postMessage.calledOnceWith(object));
        });
    });

    describe('emitTo()', function() {
        it('should call window.postMessage', function() {
            // Given
            const key = 'key';
            const data = 'data';
            // When
            eventBus.emitTo(key, data, window);
            // Then
            const object = { type: key, data };
            assert(window.postMessage.calledOnceWith(object));
        });
    });

    describe('_receiveMessageWindow', function() {
        it('should call each callback subscribed on "key" with the data', function() {
            // Given
            const key = 'key',
                anotherKey = 'anotherTest';
            const data = 'This is the data';
            const message = { type: key, data };

            const callbacks = {
                [key]: [spy(), spy(), spy()],
                [anotherKey]: [spy()]
            };
            eventBus.callBacks = callbacks;
            // When
            eventBus._receiveMessageWindow({ data: message });
            // Then
            assert(callbacks[key][0].calledOnceWith(data), `callbacks[${key}][0] wasn't called with "${data}"`);
            assert(callbacks[key][1].calledOnceWith(data), `callbacks[${key}][1] wasn't called with "${data}"`);
            assert(callbacks[key][2].calledOnceWith(data), `callbacks[${key}][2] wasn't called with "${data}"`);
            expect(callbacks[anotherKey][0].called).to.be.false;
        });

        it('should do nothing because no message is given', function() {
            // Given
            const key = 'key';
            const callback = spy();

            eventBus.callBacks = { [key]: [callback] };
            // When
            eventBus._receiveMessageWindow();
            // Then
            expect(callback.called).to.be.false;
        });
    });
});
