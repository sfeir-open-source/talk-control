'use strict';

import 'module-alias/register';
import { assert } from 'chai';
import { spy, stub } from 'sinon';
import * as pluginLoader from '@plugins/plugin-loader';
import pluginService from '@services/plugin';

describe('Plugin service', function() {
    describe('activatePluginOnController', function() {
        it('should call required functions if plugin is usedByAComponent', async function() {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                usedByAComponent: true
            };
            const params = {
                controllerComponentChannel: {
                    on: spy(),
                    broadcast: spy()
                },
                controllerServerChannel: {
                    on: spy(),
                    broadcast: spy()
                }
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginService.activateOnController(pluginName, params);

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(params.controllerComponentChannel.on.calledWith(pluginInstance.type));
            assert.isOk(params.controllerComponentChannel.broadcast.calledWith('activatePlugin'));

            // Finally
            pluginLoader.loadPluginModule.restore();
        });

        it('should call required functions if plugin is NOT usedByAComponent', async function() {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                usedByAComponent: false,
                init: spy(),
                onEvent: spy()
            };
            const params = {
                controllerComponentChannel: {
                    broadcast: stub()
                },
                controllerServerChannel: {
                    broadcast: stub()
                }
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginService.activateOnController(pluginName, params);

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(pluginInstance.init.called);
            assert.isOk(pluginInstance.onEvent.called);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });
    });

    describe('activatePluginOnController - already initialized', function() {
        it('should NOT call init when plugin is already initialized', async function() {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                usedByAComponent: false,
                initialized: true, // already initialized
                init: spy(),
                onEvent: spy()
            };
            const params = {
                controllerComponentChannel: { broadcast: stub() },
                controllerServerChannel: { broadcast: stub() }
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginService.activateOnController(pluginName, params);

            // Then
            assert.isOk(pluginInstance.init.notCalled);
            assert.isOk(pluginInstance.onEvent.notCalled);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });
    });

    describe('deactivatePluginOnController', function() {
        it('should call plugin.instance.unload()', async function() {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                unload: spy()
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginService.deactivateOnController(pluginName);

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(pluginInstance.unload.called);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });

        it('should catch error when loadPluginModule rejects', async function() {
            // Given
            const pluginName = 'pluginName';
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.reject(new Error('load error')));

            // When - should not throw
            await pluginService.deactivateOnController(pluginName);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });
    });

    describe('activatePluginOnComponent', function() {
        it('should call required functions', async function() {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                init: spy(),
                onEvent: spy()
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginService.activateOnComponent(pluginName, {});

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(pluginInstance.init.called);
            assert.isOk(pluginInstance.onEvent.called);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });

        it('should NOT call init when plugin is already initialized', async function() {
            // Given
            const pluginName = 'pluginName';
            const pluginInstance = {
                type: 'type',
                initialized: true,
                init: spy(),
                onEvent: spy()
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginService.activateOnComponent(pluginName, {});

            // Then
            assert.isOk(pluginInstance.init.notCalled);
            assert.isOk(pluginInstance.onEvent.notCalled);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });

        it('should catch error when loadPluginModule rejects', async function() {
            // Given
            const pluginName = 'pluginName';
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.reject(new Error('load error')));

            // When - should not throw
            await pluginService.activateOnComponent(pluginName, {});

            // Finally
            pluginLoader.loadPluginModule.restore();
        });
    });
});
