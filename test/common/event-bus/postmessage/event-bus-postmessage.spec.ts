import { EventBusPostMessage } from '@event-bus/postmessage/event-bus-postmessage';

describe('EventBusPostMessage', function () {
    let eventBus!: EventBusPostMessage;
    let postMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(function () {
        postMessageMock = vi.fn();
        vi.stubGlobal('postMessage', postMessageMock);
        vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
        eventBus = new EventBusPostMessage({ postMessage: {} } as any);
        (window.addEventListener as ReturnType<typeof vi.fn>).mockRestore();
    });

    afterEach(function () {
        vi.unstubAllGlobals();
    });

    describe('constructor()', function () {
        it('should have instantiated EventBusWebsocketsServer', function () {
            expect(eventBus).toBeTruthy();
        });
    });

    describe('broadcast()', function () {
        it('should call window.postMessage', function () {
            // Given
            const key = 'key';
            const data = 'data';
            eventBus.windows = [window];
            // When
            eventBus.broadcast(key, data);
            // Then
            expect(postMessageMock).toHaveBeenCalledExactlyOnceWith({ type: key, data }, '*');
        });
    });

    describe('emitTo()', function () {
        it('should call window.postMessage', function () {
            // Given
            const key = 'key';
            const data = 'data';
            // When
            eventBus.emitTo(key, data, window);
            // Then
            expect(postMessageMock).toHaveBeenCalledExactlyOnceWith({ type: key, data }, '*');
        });
    });

    describe('_receiveMessageWindow', function () {
        it('should call each callback subscribed on "key" with the data', function () {
            // Given
            const key = 'key',
                anotherKey = 'anotherTest';
            const data = 'This is the data';
            const message = { type: key, data };

            const callbacks = {
                [key]: [vi.fn(), vi.fn(), vi.fn()],
                [anotherKey]: [vi.fn()]
            };
            eventBus.callBacks = callbacks;
            // When
            eventBus._receiveMessageWindow({ data: message } as MessageEvent);
            // Then
            expect(callbacks[key][0]).toHaveBeenCalledExactlyOnceWith(data);
            expect(callbacks[key][1]).toHaveBeenCalledExactlyOnceWith(data);
            expect(callbacks[key][2]).toHaveBeenCalledExactlyOnceWith(data);
            expect(callbacks[anotherKey][0]).not.toHaveBeenCalled();
        });

        it('should do nothing because no message is given', function () {
            // Given
            const key = 'key';
            const callback = vi.fn();

            eventBus.callBacks = { [key]: [callback] };
            // When
            eventBus._receiveMessageWindow(undefined as unknown as MessageEvent);
            // Then
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
