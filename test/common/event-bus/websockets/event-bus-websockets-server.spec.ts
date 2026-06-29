import { EventBusWebsocketsServer } from '@event-bus/websockets/event-bus-websockets-server';

describe('EventBusWebsocketsServer', function () {
    let eventBus = new EventBusWebsocketsServer(undefined as any);

    beforeEach(function () {
        eventBus = new EventBusWebsocketsServer(undefined as any);
    });

    describe('constructor()', function () {
        it('should have instantiated EventBusWebsocketsServer', function () {
            expect(eventBus).toBeTruthy();
        });

        it('should add socket to sockets array on connection', function () {
            // Given
            const mockSocket = {
                id: 'socket-1',
                handshake: { headers: { referer: 'http://test' } },
                on: vi.fn()
            };
            // Get the connection listener registered in the constructor
            const connectionListeners = eventBus.io.listeners('connection');
            expect(connectionListeners.length).toBeGreaterThan(0);
            const connectionCallback = connectionListeners[0] as unknown as (socket: typeof mockSocket) => void;
            // When
            connectionCallback(mockSocket);
            // Then
            expect(eventBus.sockets).toContain(mockSocket);
        });

        it('should remove socket from sockets array on disconnect', function () {
            // Given
            let disconnectCallback: (() => void) | undefined;
            const mockSocket = {
                id: 'socket-1',
                handshake: { headers: {} },
                on: (event: string, cb: () => void) => {
                    if (event === 'disconnect') disconnectCallback = cb;
                }
            };
            const connectionListeners = eventBus.io.listeners('connection');
            const connectionCallback = connectionListeners[0] as unknown as (socket: typeof mockSocket) => void;
            connectionCallback(mockSocket);
            expect(eventBus.sockets).toContain(mockSocket);
            // When
            disconnectCallback!();
            // Then
            expect(eventBus.sockets).not.toContain(mockSocket);
        });

        it('should subscribe new socket on existing keys', function () {
            // Given
            const onMultipleSpy = vi.spyOn(eventBus, 'onMultiple');
            eventBus.callBacks['existingKey'] = [() => {}];
            const mockSocket = {
                id: 'socket-2',
                handshake: { headers: {} },
                on: vi.fn()
            };
            const connectionListeners = eventBus.io.listeners('connection');
            const connectionCallback = connectionListeners[0] as unknown as (socket: typeof mockSocket) => void;
            // When
            connectionCallback(mockSocket);
            // Then
            expect(onMultipleSpy).toHaveBeenCalledWith('existingKey', null, mockSocket);
            onMultipleSpy.mockRestore();
        });
    });

    describe('on()', function () {
        it('should call onMultiple', function () {
            // Given
            const key = 'key';
            const callback = () => 'callback';
            const socket = 'socket';
            const onMultipleSpy = vi.spyOn(eventBus, 'onMultiple').mockImplementation(() => {});
            // When
            eventBus.on(key, callback, socket as any);
            // Then
            expect(onMultipleSpy).toHaveBeenCalledWith(key, callback, socket);
            onMultipleSpy.mockRestore();
        });

        it('should not throw when super.on throws (duplicate key error path)', function () {
            // Given
            const key = 'key';
            const callback = () => 'callback';
            // Register the key once
            eventBus.on(key, callback);
            // When - calling on() a second time with the same key should trigger the duplicate error
            // but it should be caught internally and not propagate
            expect(() => {
                eventBus.on(key, () => 'second callback');
            }).not.toThrow();
        });
    });

    describe('onMultiple()', function () {
        it('should fire events', function () {
            // Given
            const socketA = { on: vi.fn() },
                socketB = { on: vi.fn() },
                socketC = { on: vi.fn() };
            const key = 'key';
            eventBus.sockets = [socketA, socketB, socketC] as any;
            // When
            eventBus.on(key, () => key);
            // Then
            expect(socketA.on).toHaveBeenCalledExactlyOnceWith(key, expect.any(Function));
            expect(socketB.on).toHaveBeenCalledExactlyOnceWith(key, expect.any(Function));
            expect(socketC.on).toHaveBeenCalledExactlyOnceWith(key, expect.any(Function));
        });

        it('should add key only on given socket', function () {
            // Given
            const socketA = { on: vi.fn() },
                socketB = { on: vi.fn() },
                socketC = { on: vi.fn() };
            const key = 'key';
            eventBus.sockets = [socketA, socketB] as any;
            // When
            eventBus.on(key, null as any, socketC as any);
            // Then
            expect(socketA.on).not.toHaveBeenCalled();
            expect(socketB.on).not.toHaveBeenCalled();
            expect(socketC.on).toHaveBeenCalledExactlyOnceWith(key, expect.any(Function));
        });
    });

    describe('broadcast()', function () {
        it('should broadcast the data', function () {
            // Given
            vi.spyOn(eventBus.io, 'emit').mockImplementation(() => false);
            const key = 'key';
            const message = 'message';
            // When
            eventBus.broadcast(key, message, false);
            // Then
            expect(eventBus.io.emit).not.toHaveBeenCalled();
            (eventBus.io.emit as ReturnType<typeof vi.fn>).mockRestore();
        });

        it('should call io.emit when broadcast=true', function () {
            // Given
            vi.spyOn(eventBus.io, 'emit').mockImplementation(() => false);
            const key = 'key';
            const message = 'message';
            // When
            eventBus.broadcast(key, message, true);
            // Then
            expect(eventBus.io.emit).toHaveBeenCalledExactlyOnceWith(key, message);
            (eventBus.io.emit as ReturnType<typeof vi.fn>).mockRestore();
        });

        it('should call io.emit by default (no broadcast param)', function () {
            // Given
            vi.spyOn(eventBus.io, 'emit').mockImplementation(() => false);
            const key = 'key';
            const message = 'message';
            // When
            eventBus.broadcast(key, message);
            // Then
            expect(eventBus.io.emit).toHaveBeenCalledExactlyOnceWith(key, message);
            (eventBus.io.emit as ReturnType<typeof vi.fn>).mockRestore();
        });
    });

    describe('emitTo()', function () {
        it('should emit the data', function () {
            // Given
            const socket = {
                emit: () => {}
            };
            const emitSpy = vi.spyOn(socket, 'emit').mockImplementation(() => {});
            const key = 'key';
            const data = 'data';
            // When
            eventBus.emitTo(key, data, socket as any);
            // Then
            expect(emitSpy).toHaveBeenCalledWith(key, data);
            emitSpy.mockRestore();
        });
    });
});
