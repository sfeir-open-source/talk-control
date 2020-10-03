'use strict';

import { CONTROLLER_COMPONENT_CHANNEL, CONTROLLER_SERVER_CHANNEL } from '@event-bus/event-bus-resolver';
import { loadPluginModule } from '@plugins/plugin-loader';

module.exports = {
    activatePluginOnController(pluginName, controller) {
        return loadPluginModule(pluginName)
            .then(plugin => {
                if (plugin.instance.usedByAComponent) {
                    // Plugins used by a component and need tc-component (ex: keyboard)
                    controller.eventBusController.on(
                        CONTROLLER_COMPONENT_CHANNEL,
                        plugin.instance.type,
                        event => controller.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, plugin.instance.type, event)
                    );

                    controller.eventBusController.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'activatePlugin', { pluginName });
                    return;
                }

                // Other plugins like bluetooth devices
                if (!plugin.instance.initialized) {
                    plugin.instance.init();
                    plugin.instance.onEvent(event => controller.eventBusController.broadcast(CONTROLLER_SERVER_CHANNEL, plugin.instance.type, event));
                }
            })
            .catch(e => console.error('Unable to load plugin module', e));
    },

    deactivatePluginOnController(pluginName) {
        return loadPluginModule(pluginName)
            .then(plugin => plugin.instance.unload())
            .catch(e => console.error('Unable to unload plugin module', e));
    },

    activatePluginOnComponent(pluginName, component) {
        return loadPluginModule(pluginName)
            .then(plugin => {
                if (!plugin.instance.initialized) {
                    plugin.instance.init();
                    plugin.instance.onEvent((type, event) => component.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, type, event));
                }
            })
            .catch(e => console.error('Unable to load plugin module', e));
    }
};
