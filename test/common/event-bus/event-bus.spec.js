'use strict';

import 'module-alias/register';
import { expect } from 'chai';
import { EventBus, NO_KEY_PROVIDED, NO_TARGET_PROVIDED, DUPLICATE_CALLBACKS_ENTRY } from '@event-bus/event-bus';

describe('EventBus', function() {
    let eventBus = new EventBus();
    beforeEach(function() {
        eventBus = new EventBus();
    });

    describe('constructor()', function() {
        it('should have instantiated EventBusWebsocketsServer', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('on()', function() {
        it('should throw an error if no key provided', function() {
            expect(() => eventBus.on(undefined, () => 'test')).to.throw(NO_KEY_PROVIDED);
        });

        it('should throw an error if callback already registered', function() {
            eventBus.callBacks['key'] = () => 'key';
            expect(() => eventBus.on('key', () => 'test')).to.throw(DUPLICATE_CALLBACKS_ENTRY);
        });

        it('should add a callback', function() {
            // Given
            const key = 'key';
            const callback = () => key;
            // When
            eventBus.on(key, callback);
            // Then
            expect(eventBus.callBacks[key])
                .to.be.an('array')
                .that.include(callback);
        });
    });

    describe('onMultiple()', function() {
        it('should throw an error if no key provided', function() {
            expect(() => eventBus.onMultiple(undefined, () => 'test')).to.throw(NO_KEY_PROVIDED);
        });

        it('should add a callback', function() {
            // Given
            const key = 'key';
            const callback = () => key;
            // When
            eventBus.onMultiple(key, callback);
            // Then
            expect(eventBus.callBacks[key])
                .to.be.an('array')
                .that.include(callback);
        });
    });

    describe('broadcast()', function() {
        it('should throw an error', function() {
            expect(() => eventBus.broadcast(undefined, 'test')).to.throw(NO_KEY_PROVIDED);
        });

        it("shouldn't fire any event", function() {
            // Given
            let isFirstOneCalled = false,
                isSecondOneCalled = false;
            eventBus.onMultiple('test', () => (isFirstOneCalled = true));
            eventBus.onMultiple('test', () => (isSecondOneCalled = true));
            // When
            eventBus.broadcast('anotherTest', undefined);
            // Then
            expect(isFirstOneCalled).to.be.false;
            expect(isSecondOneCalled).to.be.false;
        });

        it('should fire all the subscribed callback', function() {
            // Given
            let isFirstOneCalled = false,
                isSecondOneCalled = false;
            eventBus.onMultiple('test', () => (isFirstOneCalled = true));
            eventBus.onMultiple('test', () => (isSecondOneCalled = true));
            // When
            eventBus.broadcast('test', undefined);
            // Then
            expect(isFirstOneCalled).to.be.true;
            expect(isSecondOneCalled).to.be.true;
        });
    });

    describe('emitTo()', function() {
        it('should throw an error if no key provided', function() {
            expect(() => eventBus.emitTo(undefined, 'data')).to.throw(NO_KEY_PROVIDED);
        });

        it('should throw an error if no target provided', function() {
            expect(() => eventBus.emitTo('key', 'data')).to.throw(NO_TARGET_PROVIDED);
        });
    });

    describe('getCallbacks()', function() {
        it('should throw an error', function() {
            expect(() => eventBus.getCallbacks()).to.throw(NO_KEY_PROVIDED);
        });

        it('sould retrun an empty array', function() {
            // Given
            const key = 'key';
            // When
            const callbacks = eventBus.getCallbacks(key);
            // Then
            expect(callbacks).to.be.an('array').and.to.be.empty;
        });

        it('should return all the callbacks', function() {
            // Given
            const key = 'key';
            const callback1 = () => 'callback 1',
                callback2 = () => 'callback 2';
            eventBus.onMultiple(key, callback1);
            eventBus.onMultiple(key, callback2);
            // When
            const callbacks = eventBus.getCallbacks(key);
            // Then
            expect(callbacks)
                .to.be.an('array')
                .that.includes(callback1)
                .and.that.includes(callback2);
        });
    });
});
