'use strict';

import { loadPluginModule } from '@plugins/plugin-loader';

/**
 * @param pluginName
 * @param controller
 */
function activateOnController(pluginName, controller) {
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
}

/**
 * @param pluginName
 */
function deactivateOnController(pluginName) {
    return loadPluginModule(pluginName)
        .then(plugin => plugin.instance.unload())
        .catch(e => console.error('Unable to unload plugin module', e));
}

/**
 * @param pluginName
 * @param component
 */
function activateOnComponent(pluginName, component) {
    return loadPluginModule(pluginName)
        .then(plugin => {
            if (!plugin.instance.initialized) {
                plugin.instance.init();
                plugin.instance.onEvent((type, event) => component.channel.broadcast(type, event));
            }
        })
        .catch(e => console.error('Unable to load plugin module', e));
}

export default { activateOnController, deactivateOnController, activateOnComponent };
