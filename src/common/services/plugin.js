'use strict';

import { loadPluginModule } from '@plugins/plugin-loader';

export default {
    activatePluginOnController(pluginName, controller) {
        return loadPluginModule(pluginName)
            .then(plugin => {
                if (plugin.instance.usedByAComponent) {
                    // Plugins used by a component and need tc-component (ex: keyboard)
                    controller.componentChannel.on(plugin.instance.type, event => controller.serverChannel.broadcast(plugin.instance.type, event));

                    controller.componentChannel.broadcast('activatePlugin', { pluginName });
                    return;
                }

                // Other plugins like bluetooth devices
                if (!plugin.instance.initialized) {
                    plugin.instance.init();
                    plugin.instance.onEvent(event => controller.serverChannel.broadcast(plugin.instance.type, event));
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
                    plugin.instance.onEvent((type, event) => component.channel.broadcast(type, event));
                }
            })
            .catch(e => console.error('Unable to load plugin module', e));
    }
};
