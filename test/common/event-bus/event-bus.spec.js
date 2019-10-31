import 'module-alias/register';
import { expect } from 'chai';
import { EventBus } from '@event-bus/event-bus';

describe('EventBus', function() {
    let eventBus = new EventBus();
    beforeEach(function() {
        eventBus = new EventBus();
    });

    describe('constructor()', function() {
        it('should have instantiated SocketEventBus', function() {
            expect(eventBus).to.be.ok;
        });
    });

    describe('on()', function() {
        it('should throw an error', function() {
            expect(() => eventBus.on(undefined, () => 'test')).to.throw('No key provided');
        });

        it('should add a callback', function() {
            // Given
            const key = 'test';
            const callback = () => key;
            // When
            eventBus.on(key, callback);
            // Then
            expect(eventBus.callBacks[key])
                .to.be.an('array')
                .that.include(callback);
        });
    });

    describe('emit()', function() {
        it('should throw an error', function() {
            expect(() => eventBus.emit(undefined, 'test')).to.throw('No key provided');
        });

        it("shouldn't fire any event", function() {
            // Given
            const key = 'test',
                anotherKey = 'anotherTest';
            let isFirstOneCalled = false,
                isSecondOneCalled = false;
            eventBus.on(key, () => (isFirstOneCalled = true));
            eventBus.on(key, () => (isSecondOneCalled = true));
            // When
            eventBus.emit(anotherKey, undefined);
            // Then
            expect(isFirstOneCalled).to.be.false;
            expect(isSecondOneCalled).to.be.false;
        });

        it('should fire all the subscribed callback', function() {
            // Given
            const key = 'test';
            let isFirstOneCalled = false,
                isSecondOneCalled = false;
            eventBus.on(key, () => (isFirstOneCalled = true));
            eventBus.on(key, () => (isSecondOneCalled = true));
            // When
            eventBus.emit(key, undefined);
            // Then
            expect(isFirstOneCalled).to.be.true;
            expect(isSecondOneCalled).to.be.true;
        });
    });

    describe('getCallbacks()', function() {
        it('should throw an error', function() {
            expect(() => eventBus.getCallbacks()).to.throw('No key provided');
        });

        it('sould retrun an empty array', function() {
            // Given
            const key = 'test';
            // When
            const callbacks = eventBus.getCallbacks(key);
            // Then
            expect(callbacks).to.be.an('array').and.to.be.empty;
        });

        it('should return all the callbacks', function() {
            // Given
            const key = 'test';
            const callback1 = () => 'callback 1',
                callback2 = () => 'callback 2';
            eventBus.on(key, callback1);
            eventBus.on(key, callback2);
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
