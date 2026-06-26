'use strict';

import { loadPluginModule } from '@plugins/plugin-loader';
import pluginService from '@services/plugin';

vi.mock('@plugins/plugin-loader');

describe('Plugin service', function () {
    afterEach(function () {
        vi.resetAllMocks();
    });

    describe('activatePluginOnController', function () {
        it('should call required functions if plugin is usedByAComponent', async function () {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                usedByAComponent: true
            };
            const params = {
                controllerComponentChannel: {
                    on: vi.fn(),
                    broadcast: vi.fn()
                },
                controllerServerChannel: {
                    on: vi.fn(),
                    broadcast: vi.fn()
                }
            };
            vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });

            // When
            await pluginService.activateOnController(pluginName, params);

            // Then
            expect(loadPluginModule).toHaveBeenCalledWith(pluginName);
            expect(params.controllerComponentChannel.on).toHaveBeenCalledWith(pluginInstance.type, expect.any(Function));
            expect(params.controllerComponentChannel.broadcast).toHaveBeenCalledWith('activatePlugin', { pluginName });
        });

        it('should call required functions if plugin is NOT usedByAComponent', async function () {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                usedByAComponent: false,
                init: vi.fn(),
                onEvent: vi.fn()
            };
            const params = {
                controllerComponentChannel: {
                    broadcast: vi.fn()
                },
                controllerServerChannel: {
                    broadcast: vi.fn()
                }
            };
            vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });

            // When
            await pluginService.activateOnController(pluginName, params);

            // Then
            expect(loadPluginModule).toHaveBeenCalledWith(pluginName);
            expect(pluginInstance.init).toHaveBeenCalled();
            expect(pluginInstance.onEvent).toHaveBeenCalled();
        });
    });

    describe('activatePluginOnController - already initialized', function () {
        it('should NOT call init when plugin is already initialized', async function () {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                usedByAComponent: false,
                initialized: true,
                init: vi.fn(),
                onEvent: vi.fn()
            };
            const params = {
                controllerComponentChannel: { broadcast: vi.fn() },
                controllerServerChannel: { broadcast: vi.fn() }
            };
            vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });

            // When
            await pluginService.activateOnController(pluginName, params);

            // Then
            expect(pluginInstance.init).not.toHaveBeenCalled();
            expect(pluginInstance.onEvent).not.toHaveBeenCalled();
        });
    });

    describe('deactivatePluginOnController', function () {
        it('should call plugin.instance.unload()', async function () {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                unload: vi.fn()
            };
            vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });

            // When
            await pluginService.deactivateOnController(pluginName);

            // Then
            expect(loadPluginModule).toHaveBeenCalledWith(pluginName);
            expect(pluginInstance.unload).toHaveBeenCalled();
        });

        it('should catch error when loadPluginModule rejects', async function () {
            // Given
            const pluginName = 'pluginName';
            vi.mocked(loadPluginModule).mockRejectedValue(new Error('load error'));

            // When - should not throw
            let threw = false;
            try {
                await pluginService.deactivateOnController(pluginName);
            } catch {
                threw = true;
            }
            expect(threw).toBe(false);
        });
    });

    describe('activatePluginOnComponent', function () {
        it('should call required functions', async function () {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                init: vi.fn(),
                onEvent: vi.fn()
            };
            vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });

            // When
            await pluginService.activateOnComponent(pluginName, {});

            // Then
            expect(loadPluginModule).toHaveBeenCalledWith(pluginName);
            expect(pluginInstance.init).toHaveBeenCalled();
            expect(pluginInstance.onEvent).toHaveBeenCalled();
        });

        it('should NOT call init when plugin is already initialized', async function () {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                initialized: true,
                init: vi.fn(),
                onEvent: vi.fn()
            };
            vi.mocked(loadPluginModule).mockResolvedValue({ instance: pluginInstance });

            // When
            await pluginService.activateOnComponent(pluginName, {});

            // Then
            expect(pluginInstance.init).not.toHaveBeenCalled();
            expect(pluginInstance.onEvent).not.toHaveBeenCalled();
        });

        it('should catch error when loadPluginModule rejects', async function () {
            // Given
            const pluginName = 'pluginName';
            vi.mocked(loadPluginModule).mockRejectedValue(new Error('load error'));

            // When - should not throw
            let threw = false;
            try {
                await pluginService.activateOnComponent(pluginName, {});
            } catch {
                threw = true;
            }
            expect(threw).toBe(false);
        });
    });
});
