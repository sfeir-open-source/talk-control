import { expect } from 'chai';
import { assert, spy, stub, useFakeTimers } from 'sinon';
import configureStore from 'redux-mock-store';
import { TCServer } from '@server/tc-server';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { EventBus } from '@event-bus/event-bus';
import { EngineResolver } from '@server/engines/engine-resolver';
import { GenericEngine } from '@server/engines/generic-server-engine';
import pluginConfigService from '@services/plugin-config';

const mockStore = configureStore([]);
describe('TCServer', function() {
    let resolveChannel, controllerChannel, server;
    const httpServer = { port: 3000 };
    let resolveEngine, engine;
    const engineName = 'ENGINE_NAME';
    let clock;

    before(function() {
        clock = useFakeTimers();
        resolveChannel = stub(EventBusResolver, 'channel');
        resolveEngine = stub(EngineResolver, 'getEngine');
    });

    after(function() {
        clock.restore();
        resolveChannel.restore();
        resolveEngine.restore();
    });

    beforeEach(function() {
        controllerChannel = spy(new EventBus());
        resolveChannel.withArgs(Channels.CONTROLLER_SERVER).returns(controllerChannel);

        engine = spy(new GenericEngine());
        stub(engine, 'store').value(mockStore({}));
        resolveEngine.withArgs(engineName).returns(engine);

        server = new TCServer(httpServer);
    });

    it('should resolve controller channel', function() {
        assert.calledWithExactly(EventBusResolver.channel, Channels.CONTROLLER_SERVER, { server: httpServer });
        expect(EventBusResolver.channel.getCalls().length).to.be.equal(1);
        expect(server.channel).to.be.equal(controllerChannel);
    });

    it('should resolve engine on initialization', function() {
        // Given
        const eng = {
            name: engineName,
            handleInput: () => {},
            store: mockStore({})
        };
        resolveEngine.withArgs(engineName).returns(eng);
        // When
        server.init(engineName);
        // Then
        expect(server.engine).to.be.equal(eng);
    });

    describe('control', function() {
        beforeEach(function() {
            server.init(engineName);
        });

        it('should init engine when presentation is initialized', async function() {
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
            await clock.nextAsync();
            assert.calledWithExactly(engine.init, data);
        });

        it('should push plugins config when presentation is initialized', async function() {
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
            stub(pluginConfigService, 'getPlugins').returns(plugins);
            // When
            controllerChannel.broadcast('init', data);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(controllerChannel.broadcast, 'pluginsList', plugins);
        });

        it('should handle control input through engine', async function() {
            // Given
            const input = { key: 'arrowTest' };
            // When
            controllerChannel.broadcast('inputEvent', input);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(engine.handleInput, input);
        });

        it('should command plugin activation on controllers when plugin need to be activated', async function() {
            // Given
            const data = { pluginName: 'plugin0' };
            // When
            controllerChannel.broadcast('pluginStartingIn', data);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(controllerChannel.broadcast, 'pluginStartingOut', data);
        });

        it('should command plugin deactivation on controllers when plugin need to be deactivated', async function() {
            // Given
            const data = { pluginName: 'plugin0' };
            // When
            controllerChannel.broadcast('pluginEndingIn', data);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(controllerChannel.broadcast, 'pluginEndingOut', data);
        });

        it('should notify controllers of plugin event', async function() {
            // Given
            const data = { type: 'touchPointer' };
            // When
            controllerChannel.broadcast('pluginEventIn', data);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(controllerChannel.broadcast, 'pluginEventOut', data);
        });

        it('should notify controllers of state change', async function() {
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
            resolveEngine.withArgs(engineName).returns(eng);
            server.init(engineName);
            // When
            await eng.store.dispatch({ type: 'ACTION' });
            // Then
            assert.calledWithExactly(controllerChannel.broadcast, 'gotoSlide', { slide: { h: 1, v: 0, f: 0 } });
        });
    });
});
