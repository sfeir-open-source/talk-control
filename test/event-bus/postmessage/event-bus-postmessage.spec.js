import { expect, assert } from 'chai';
import { spy, stub } from 'sinon';
import { PostMessageEventBus } from '../../../src/event-bus/postmessage/event-bus-postmessage';

describe('PostMessageEventBus', function() {
    let eventBus;
    beforeEach(function() {
        // global.window = { addEventListener: () => undefined, postMessage: spy() };
        stub(window, 'addEventListener');
        spy(window, 'postMessage');
        eventBus = new PostMessageEventBus();
    });

    afterEach(function() {
        window.addEventListener.restore();
        window.postMessage.restore();
    });

    describe('constructor()', function() {
        it('should have instantiated SocketEventBus', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('emit()', function() {
        it('should call window.postMessage', function() {
            // Given
            const key = 'test';
            const data = 'data';
            // When
            eventBus.emit(key, data);
            // Then
            const jsonObject = JSON.stringify({ type: key, data });
            assert(window.postMessage.calledOnceWith(jsonObject));
        });
    });

    describe('_receiveMessageWindow', function() {
        it('should call each callback substribed on "key" with the data', function() {
            // Given
            const key = 'test',
                anotherKey = 'anotherTest';
            const data = 'This is the data';
            const message = { type: key, data };

            const callbacks = {
                [key]: [spy(), spy(), spy()],
                [anotherKey]: [spy()]
            };
            eventBus.callBacks = callbacks;
            // When
            eventBus._receiveMessageWindow({ data: JSON.stringify(message) });
            // Then
            assert(callbacks[key][0].calledOnceWith(message), `callbacks[${key}][0] wasn't called with "${message}"`);
            assert(callbacks[key][1].calledOnceWith(message), `callbacks[${key}][1] wasn't called with "${message}"`);
            assert(callbacks[key][2].calledOnceWith(message), `callbacks[${key}][2] wasn't called with "${message}"`);
            expect(callbacks[anotherKey][0].called).to.be.false;
        });

        it('should do nothing because no message is given', function() {
            // Given
            const key = 'test';
            const callback = spy();

            eventBus.callBacks = { [key]: [callback] };
            // When
            eventBus._receiveMessageWindow();
            // Then
            expect(callback.called).to.be.false;
        });
    });
});
