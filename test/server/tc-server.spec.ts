import configureStore from 'redux-mock-store';
import { TCServer } from '@server/tc-server';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { EventBus } from '@event-bus/event-bus';
import { EngineResolver } from '@server/engines/engine-resolver';
import { GenericEngine } from '@server/engines/generic-server-engine';
import * as configModule from '@services/config';
import { spyOnAll } from '../helpers/test-utils.js';

vi.mock('@services/config', async orig => ({ ...(await orig()) }));

const mockStore = (configureStore as (...args: any[]) => any)([]);

describe('TCServer', function () {
    let resolveChannel: ReturnType<typeof vi.spyOn>, controllerChannel: EventBus, server!: TCServer;
    let resolveEngine: ReturnType<typeof vi.spyOn>, engine!: GenericEngine;
    const httpServer = { port: 3000 };
    const engineName = 'ENGINE_NAME';

    beforeAll(function () {
        vi.useFakeTimers();
        resolveChannel = vi.spyOn(EventBusResolver, 'channel').mockImplementation((() => {}) as any);
        resolveEngine = vi.spyOn(EngineResolver, 'getEngine').mockImplementation((() => {}) as any);
    });

    afterAll(function () {
        vi.useRealTimers();
        resolveChannel.mockRestore();
        resolveEngine.mockRestore();
    });

    beforeEach(function () {
        controllerChannel = spyOnAll(new EventBus());
        resolveChannel.mockImplementation(((channel: string) => (channel === Channels.CONTROLLER_SERVER ? controllerChannel : undefined)) as any);

        engine = spyOnAll(new GenericEngine());
        engine.store = mockStore({});
        resolveEngine.mockImplementation(((name: string) => (name === engineName ? engine : undefined)) as any);

        server = new TCServer(httpServer as any);
    });

    it('should resolve controller channel', function () {
        expect(resolveChannel).toHaveBeenCalledWith(Channels.CONTROLLER_SERVER, { server: httpServer });
        expect(resolveChannel).toHaveBeenCalledTimes(1);
        expect(server.controllerServerChannel).toBe(controllerChannel);
    });

    it('should resolve engine on initialization', function () {
        // Given
        const eng = {
            name: engineName,
            handleInput: () => {},
            store: mockStore({})
        };
        resolveEngine.mockImplementation(((name: string) => (name === engineName ? eng : undefined)) as any);
        // When
        server.init(engineName);
        // Then
        expect(server.engine).toBe(eng);
    });

    describe('control', function () {
        beforeEach(function () {
            server.init(engineName);
        });

        it('should init engine when presentation is initialized', async function () {
            // Given
            const data = {
                slides: [
                    { h: 0, v: 0, f: 0, fMax: 0 },
                    { h: 1, v: 0, f: 0, fMax: 0 }
                ]
            };
            // When
            controllerChannel.broadcast('init', data);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(engine.init).toHaveBeenCalledWith(data);
        });

        it('should push plugins config when presentation is initialized', async function () {
            // Given
            const data = {
                slides: [
                    { h: 0, v: 0, f: 0, fMax: 0 },
                    { h: 1, v: 0, f: 0, fMax: 0 }
                ]
            };
            const plugins = [
                { name: 'keyboardInput', autoActivate: true },
                { name: 'touchInput', autoActivate: true },
                { name: 'touchPointerInput', autoActivate: false }
            ];
            const pluginsSpy = vi.spyOn(configModule, 'plugins', 'get').mockReturnValue(plugins as any);
            // When
            controllerChannel.broadcast('init', data);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(controllerChannel.broadcast).toHaveBeenCalledWith('pluginsList', plugins);
            pluginsSpy.mockRestore();
        });

        it('should handle control input through engine', async function () {
            // Given
            const input = { key: 'arrowTest' };
            // When
            controllerChannel.broadcast('inputEvent', input);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(engine.handleInput).toHaveBeenCalledWith(input);
        });

        it('should command plugin activation on controllers when plugin need to be activated', async function () {
            // Given
            const data = { pluginName: 'plugin0' };
            // When
            controllerChannel.broadcast('pluginStartingIn', data);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(controllerChannel.broadcast).toHaveBeenCalledWith('pluginStartingOut', data);
        });

        it('should command plugin deactivation on controllers when plugin need to be deactivated', async function () {
            // Given
            const data = { pluginName: 'plugin0' };
            // When
            controllerChannel.broadcast('pluginEndingIn', data);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(controllerChannel.broadcast).toHaveBeenCalledWith('pluginEndingOut', data);
        });

        it('should notify controllers of plugin event', async function () {
            // Given
            const data = { type: 'touchPointer' };
            // When
            controllerChannel.broadcast('pluginEventIn', data);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(controllerChannel.broadcast).toHaveBeenCalledWith('pluginEventOut', data);
        });

        it('should notify controllers of state change', async function () {
            // Given
            const eng = {
                name: engineName,
                handleInput: () => {},
                store: mockStore({
                    currentSlide: { h: 1, v: 0, f: 0 },
                    slides: [
                        { h: 0, v: 0, f: 0, fMax: 0 },
                        { h: 1, v: 0, f: 0, fMax: 0 }
                    ]
                })
            };
            resolveEngine.mockImplementation(((name: string) => (name === engineName ? eng : undefined)) as any);
            server.init(engineName);
            // When
            await eng.store.dispatch({ type: 'ACTION' });
            // Then
            expect(controllerChannel.broadcast).toHaveBeenCalledWith('gotoSlide', { slide: { h: 1, v: 0, f: 0 } });
        });
    });
});
