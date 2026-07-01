import { ERROR_TYPE_SCRIPT_NOT_PRESENT, TCController } from '@client/tc-controller/tc-controller';
import { EventBus } from '@event-bus/event-bus';
import pluginService from '@services/plugin';
import { Channels, EventBusResolver } from '@event-bus/event-bus-resolver';
import { spyOnAll } from '../../helpers/test-utils.js';

describe('TCController', function () {
    let resolveChannel: ReturnType<typeof vi.spyOn>, serverChannel: EventBus, componentChannel: EventBus, controller!: TCController;
    const serverUrl = 'SERVER_URL';
    const presentationUrl = 'PRESENTATION_URL';

    beforeAll(function () {
        vi.useFakeTimers();
        resolveChannel = vi.spyOn(EventBusResolver, 'channel').mockImplementation((() => {}) as any);
    });

    afterAll(function () {
        vi.useRealTimers();
        resolveChannel.mockRestore();
    });

    beforeEach(function () {
        serverChannel = spyOnAll(new EventBus());
        componentChannel = spyOnAll(new EventBus());
        resolveChannel.mockImplementation(((channel: string) => {
            if (channel === Channels.CONTROLLER_SERVER) return serverChannel;
            if (channel === Channels.CONTROLLER_COMPONENT) return componentChannel;
            return undefined;
        }) as any);
        controller = new TCController(serverUrl);
    });

    it('should resolve server and component channels', function () {
        expect(resolveChannel).toHaveBeenCalledWith(Channels.CONTROLLER_SERVER, { server: serverUrl });
        expect(resolveChannel).toHaveBeenCalledWith(Channels.CONTROLLER_COMPONENT, { deep: true });
        expect(resolveChannel).toHaveBeenCalledTimes(2);
        expect(controller.controllerServerChannel).toBe(serverChannel);
        expect(controller.controllerComponentChannel).toBe(componentChannel);
    });

    it('should load presentation on initialization', function () {
        // When
        controller.init(presentationUrl);
        // Then
        expect(componentChannel.broadcast).toHaveBeenCalledWith('loadPresentation', presentationUrl);
    });

    describe('pre-control', function () {
        beforeEach(function () {
            controller.init(presentationUrl);
        });

        it('should ping presentation component when slides are loaded', async function () {
            // When
            await loadSlides(2, 2, 100);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('ping');
        });

        it('should not ping presentation component when not all slides are loaded', async function () {
            // When
            await loadSlides(1, 2, 100);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).not.toHaveBeenCalledWith('ping');
        });

        it('should init control when presentation health check response received in time', async function () {
            // Given
            const timeout = 100;
            await loadSlides(1, 1, 100);
            // When
            await respondToHealthCheck(timeout - 1);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('init');
        });

        it('should error when presentation health check response is not received', async function () {
            // Given
            await loadSlides(1, 1, 100);
            // When nothing
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
        });

        it('should error when presentation health check response is late', async function () {
            // Given
            const timeout = 100;
            await loadSlides(1, 1, 100);
            // When
            await respondToHealthCheck(timeout + 1);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('error', { type: ERROR_TYPE_SCRIPT_NOT_PRESENT });
        });
    });

    describe('control', function () {
        beforeEach(async function () {
            controller.init(presentationUrl);
            await prepareControl();
        });

        it('should notify server when presentation component is initialized', async function () {
            // Given
            const presentationData = { slides: [] };
            // When
            componentChannel.broadcast('initialized', presentationData);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(serverChannel.broadcast).toHaveBeenCalledWith('init', presentationData);
        });

        it("should notify components of presentation's slide state change", async function () {
            // Given
            const data = { slide: 9 };
            // When
            serverChannel.broadcast('gotoSlide', data);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('gotoSlide', data);
        });

        it('should forward notes from component to others', async function () {
            // Given
            const notes = [{ note: 1 }, { note: 2 }, { note: 3 }];
            // When
            componentChannel.broadcast('sendNotesToController', notes);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('sendNotesToComponent', notes);
        });

        it('should notify server of plugin event', async function () {
            // Given
            const event = { origin: 'plugin', type: 'event1' };
            // When
            componentChannel.broadcast('pluginEventIn', event);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(serverChannel.broadcast).toHaveBeenCalledWith('pluginEventIn', event);
        });

        it('should notify components of plugin event', async function () {
            // Given
            const event = { origin: 'plugin1', type: 'event1' };
            // When
            serverChannel.broadcast('pluginEventOut', event);
            // Then
            await vi.advanceTimersToNextTimerAsync();
            expect(componentChannel.broadcast).toHaveBeenCalledWith('plugin1', event);
        });

        describe('plugin start and stop flow', function () {
            beforeAll(function () {
                vi.spyOn(pluginService, 'activateOnController').mockImplementation((() => {}) as any);
                vi.spyOn(pluginService, 'deactivateOnController').mockImplementation((() => {}) as any);
            });

            afterAll(function () {
                (pluginService.activateOnController as ReturnType<typeof vi.fn>).mockRestore();
                (pluginService.deactivateOnController as ReturnType<typeof vi.fn>).mockRestore();
            });

            beforeEach(async function () {
                (pluginService.activateOnController as ReturnType<typeof vi.fn>).mockClear();
                (pluginService.deactivateOnController as ReturnType<typeof vi.fn>).mockClear();
            });

            it('should notify server when plugin need to be activated', async function () {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                componentChannel.broadcast('pluginStartingIn', data);
                // Then
                await vi.advanceTimersToNextTimerAsync();
                expect(serverChannel.broadcast).toHaveBeenCalledWith('pluginStartingIn', data);
            });

            it('should activate plugin on server command', async function () {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                serverChannel.broadcast('pluginStartingOut', data);
                // Then
                await vi.advanceTimersToNextTimerAsync();
                expect(pluginService.activateOnController).toHaveBeenCalledWith(data.pluginName, controller);
            });

            it('should notify server when plugin need to be deactivated', async function () {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                componentChannel.broadcast('pluginEndingIn', data);
                // Then
                await vi.advanceTimersToNextTimerAsync();
                expect(serverChannel.broadcast).toHaveBeenCalledWith('pluginEndingIn', data);
            });

            it('should deactivate plugin on server command', async function () {
                // Given
                const data = { pluginName: 'plugin0' };
                // When
                serverChannel.broadcast('pluginEndingOut', data);
                // Then
                await vi.advanceTimersToNextTimerAsync();
                expect(pluginService.deactivateOnController).toHaveBeenCalledWith(data.pluginName);
            });

            it('should activate auto activated plugins when plugins config is pushed', async function () {
                // Given
                const plugins = [
                    { name: 'plugin1', autoActivate: true },
                    { name: 'plugin2', autoActivate: true },
                    { name: 'plugin3', autoActivate: false }
                ];
                // When
                serverChannel.broadcast('pluginsList', plugins);
                // Then
                await vi.advanceTimersToNextTimerAsync();
                expect(pluginService.activateOnController).toHaveBeenCalledWith('plugin1', controller);
                expect(pluginService.activateOnController).toHaveBeenCalledWith('plugin2', controller);
                expect(pluginService.activateOnController).not.toHaveBeenCalledWith('plugin3', controller);
                expect(pluginService.activateOnController).toHaveBeenCalledTimes(2);
            });

            it('should add to menu manually activated plugins when plugins config is pushed', async function () {
                // Given
                const plugins = [
                    { name: 'plugin1', autoActivate: true },
                    { name: 'plugin2', autoActivate: true },
                    { name: 'plugin3', autoActivate: false }
                ];
                // When
                serverChannel.broadcast('pluginsList', plugins);
                // Then
                await vi.advanceTimersToNextTimerAsync();
                expect(componentChannel.broadcast).toHaveBeenCalledWith('addToPluginsMenu', { pluginName: 'plugin3' });
                expect(componentChannel.broadcast).not.toHaveBeenCalledWith('addToPluginsMenu', { pluginName: 'plugin1' });
                expect(componentChannel.broadcast).not.toHaveBeenCalledWith('addToPluginsMenu', { pluginName: 'plugin2' });
            });
        });
    });

    /**
     * Runs flow post control of the presentation (slide loading, presentation health check)
     */
    async function prepareControl() {
        await loadSlides(1, 1, 100);
        await respondToHealthCheck(1);
    }

    /**
     * Load slides
     *
     * @param {number} numberOfLoadedSlides - Number of slides to be loaded
     * @param {number} numberOfSlides - Number of existing slides
     * @param {number} loadingTime - Time for the slide to be loaded
     */
    async function loadSlides(numberOfLoadedSlides: number, numberOfSlides: number, loadingTime: number) {
        Array(numberOfSlides)
            .fill(0)
            .forEach(() => componentChannel.broadcast('presentationLoading'));
        await vi.advanceTimersByTimeAsync(loadingTime);
        Array(numberOfLoadedSlides)
            .fill(0)
            .forEach(() => componentChannel.broadcast('presentationLoaded'));
    }

    /**
     * Responds to health check
     *
     * @param {number} delay - Deplay in miliseconds before response
     */
    async function respondToHealthCheck(delay: number) {
        await vi.advanceTimersByTimeAsync(delay);
        componentChannel.broadcast('pong');
    }
});
