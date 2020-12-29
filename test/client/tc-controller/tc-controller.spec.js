'use strict';

import 'module-alias/register';
import { expect } from 'chai';
import { assert, spy, stub, useFakeTimers } from 'sinon';
import { ERROR_TYPE_SCRIPT_NOT_PRESENT, TCController } from '@client/tc-controller/tc-controller';
import { EventBus } from '@event-bus/event-bus';
import pluginService from '@services/plugin';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';

describe('TCController', function() {
    let resolveChannel, serverChannel, componentChannel, controller;
    let clock;
    const serverUrl = 'SERVER_URL';
    const presentationUrl = 'PRESENTATION_URL';

    before(function() {
        clock = useFakeTimers();
        resolveChannel = stub(EventBusResolver, 'channel');
    });

    after(function() {
        clock.restore();
        resolveChannel.restore();
    });

    beforeEach(function() {
        serverChannel = spy(new EventBus());
        componentChannel = spy(new EventBus());
        resolveChannel.withArgs(Channels.CONTROLLER_SERVER).returns(serverChannel);
        resolveChannel.withArgs(Channels.CONTROLLER_COMPONENT).returns(componentChannel);
        controller = new TCController(serverUrl);
    });

    it('should resolve server and component channels', function() {
        assert.calledWithExactly(EventBusResolver.channel, Channels.CONTROLLER_SERVER, { server: serverUrl });
        assert.calledWithExactly(EventBusResolver.channel, Channels.CONTROLLER_COMPONENT, { deep: true });
        expect(EventBusResolver.channel.getCalls().length).to.be.equal(2);
        expect(controller.serverChannel).to.be.equal(serverChannel);
        expect(controller.componentChannel).to.be.equal(componentChannel);
    });

    it('should load presentation on initialization', function() {
        // When
        controller.init(presentationUrl);
        // Then
        assert.calledWithExactly(componentChannel.broadcast, 'loadPresentation', presentationUrl);
    });

    describe('pre-control', function() {
        beforeEach(function() {
            controller.init(presentationUrl);
        });

        it('should ping presentation component when slides are loaded', async function() {
            // When
            await loadSlides(2, 2, 100);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'ping');
        });

        it('should not ping presentation component when not all slides are loaded', async function() {
            // When
            await loadSlides(1, 2, 100);
            // Then
            await clock.nextAsync();
            assert.neverCalledWithMatch(componentChannel.broadcast, 'ping');
        });

        it('should init control when presentation health check response received in time', async function() {
            // Given
            const timeout = 100;
            await loadSlides(1, 1, 100);
            // When
            await respondToHealthCheck(timeout - 1);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'init');
        });

        it('should error when presentation health check response is not received', async function() {
            // Given
            await loadSlides(1, 1, 100);
            // When nothing
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
        });

        it('should error when presentation health check response is late', async function() {
            // Given
            const timeout = 100;
            await loadSlides(1, 1, 100);
            // When
            await respondToHealthCheck(timeout + 1);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
        });
    });

    describe('control', function() {
        beforeEach(async function() {
            controller.init(presentationUrl);
            await prepareControl();
        });

        it('should notify server when presentation component is initialized', async function() {
            // Given
            const presentationData = { slides: [] };
            // When
            componentChannel.broadcast('initialized', presentationData);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(serverChannel.broadcast, 'init', presentationData);
        });

        it("should notify components of presentation's slide state change", async function() {
            // Given
            const data = { slide: 9 };
            // When
            serverChannel.broadcast('gotoSlide', data);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'gotoSlide', data);
        });

        it('should forward notes from component to others', async function() {
            // Given
            const notes = [{ note: 1 }, { note: 2 }, { note: 3 }];
            // When
            componentChannel.broadcast('sendNotesToController', notes);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'sendNotesToComponent', notes);
        });

        it('should notify server of plugin event', async function() {
            // Given
            const event = { origin: 'plugin', type: 'event1' };
            // When
            componentChannel.broadcast('pluginEventIn', event);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(serverChannel.broadcast, 'pluginEventIn', event);
        });

        it('should notify components of plugin event', async function() {
            // Given
            const event = { origin: 'plugin1', type: 'event1' };
            // When
            serverChannel.broadcast('pluginEventOut', event);
            // Then
            await clock.nextAsync();
            assert.calledWithExactly(componentChannel.broadcast, 'plugin1', event);
        });

        describe('plugin start and stop flow', function() {
            before(function() {
                stub(pluginService, 'activateOnController');
                stub(pluginService, 'deactivateOnController');
            });

            after(function() {
                pluginService.activateOnController.restore();
                pluginService.deactivateOnController.restore();
            });

            beforeEach(async function() {
                pluginService.activateOnController.resetHistory();
                pluginService.deactivateOnController.resetHistory();
            });

            it('should notify server when plugin need to be activated', async function() {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                componentChannel.broadcast('pluginStartingIn', data);
                // Then
                await clock.nextAsync();
                assert.calledWithExactly(serverChannel.broadcast, 'pluginStartingIn', data);
            });

            it('should activate plugin on server command', async function() {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                serverChannel.broadcast('pluginStartingOut', data);
                // Then
                await clock.nextAsync();
                assert.calledWithExactly(pluginService.activateOnController, data.pluginName, controller);
            });

            it('should notify server when plugin need to be deactivated', async function() {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                componentChannel.broadcast('pluginEndingIn', data);
                // Then
                await clock.nextAsync();
                assert.calledWithExactly(serverChannel.broadcast, 'pluginEndingIn', data);
            });

            it('should deactivate plugin on server command', async function() {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                serverChannel.broadcast('pluginEndingOut', data);
                // Then
                await clock.nextAsync();
                assert.calledWithExactly(pluginService.deactivateOnController, data.pluginName, controller);
            });

            it('should activate auto activated plugins when plugins config is pushed', async function() {
                // Given
                const plugins = [
                    { name: 'plugin1', autoActivate: true },
                    { name: 'plugin2', autoActivate: true },
                    { name: 'plugin3', autoActivate: false }
                ];
                // When
                serverChannel.broadcast('pluginsList', plugins);
                // Then
                await clock.nextAsync();
                assert.calledWithExactly(pluginService.activateOnController, 'plugin1', controller);
                assert.calledWithExactly(pluginService.activateOnController, 'plugin2', controller);
                assert.neverCalledWithMatch(pluginService.activateOnController, 'plugin3', controller);
                expect(pluginService.activateOnController.getCalls().length).to.be.equal(2);
            });

            it('should add to menu manually activated plugins when plugins config is pushed', async function() {
                // Given
                const plugins = [
                    { name: 'plugin1', autoActivate: true },
                    { name: 'plugin2', autoActivate: true },
                    { name: 'plugin3', autoActivate: false }
                ];
                // When
                serverChannel.broadcast('pluginsList', plugins);
                // Then
                await clock.nextAsync();
                assert.calledWithExactly(componentChannel.broadcast, 'addToPluginsMenu', { pluginName: 'plugin3' });
                assert.neverCalledWithMatch(componentChannel.broadcast, 'addToPluginsMenu', { pluginName: 'plugin1' });
                assert.neverCalledWithMatch(componentChannel.broadcast, 'addToPluginsMenu', { pluginName: 'plugin2' });
            });
        });
    });

    /**
     *
     */
    async function prepareControl() {
        await loadSlides(1, 1, 100);
        await respondToHealthCheck(1);
    }

    /**
     * @param numberOfLoadedSlides
     * @param numberOfSlides
     * @param loadingTime
     */
    async function loadSlides(numberOfLoadedSlides, numberOfSlides, loadingTime) {
        Array(numberOfSlides)
            .fill(0)
            .forEach(() => componentChannel.broadcast('slideLoading'));
        await clock.tickAsync(loadingTime); // loading time
        Array(numberOfLoadedSlides)
            .fill(0)
            .forEach(() => componentChannel.broadcast('slideLoaded'));
    }

    /**
     * @param delay
     */
    async function respondToHealthCheck(delay) {
        await clock.tickAsync(delay);
        componentChannel.broadcast('pong');
    }
});
