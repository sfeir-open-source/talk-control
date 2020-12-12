'use strict';

import 'module-alias/register';
import { assert } from 'chai';
import { spy, stub } from 'sinon';
import * as pluginLoader from '@plugins/plugin-loader';
import pluginServices from '@services/plugin';

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
                componentChannel: {
                    on: spy(),
                    broadcast: spy()
                },
                serverChannel: {
                    on: spy(),
                    broadcast: spy()
                }
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginServices.activatePluginOnController(pluginName, params);

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(params.componentChannel.on.calledWith(pluginInstance.type));
            assert.isOk(params.componentChannel.broadcast.calledWith('activatePlugin'));

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
                componentChannel: {
                    broadcast: stub()
                },
                serverChannel: {
                    broadcast: stub()
                }
            };
            stub(pluginLoader, 'loadPluginModule').callsFake(() => Promise.resolve({ instance: pluginInstance }));

            // When
            await pluginServices.activatePluginOnController(pluginName, params);

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(pluginInstance.init.called);
            assert.isOk(pluginInstance.onEvent.called);

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
            await pluginServices.activatePluginOnComponent(pluginName, {});

            // Then
            assert.isOk(pluginLoader.loadPluginModule.calledWith(pluginName));
            assert.isOk(pluginInstance.init.called);
            assert.isOk(pluginInstance.onEvent.called);

            // Finally
            pluginLoader.loadPluginModule.restore();
        });
    });
});
