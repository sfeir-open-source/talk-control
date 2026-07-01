import { loadPluginModule } from '@plugins/plugin-loader';
import { TCController } from '@client/tc-controller/tc-controller';
import { TCComponent } from '@client/tc-component/tc-component';

function activateOnController(pluginName: string, controller: TCController): Promise<void> {
    return loadPluginModule(pluginName)
        .then(plugin => {
            if (!plugin) return;
            if (plugin.instance.usedByAComponent) {
                controller.controllerComponentChannel.on(plugin.instance.type, event =>
                    controller.controllerServerChannel.broadcast(plugin.instance.type, event)
                );
                controller.controllerComponentChannel.broadcast('activatePlugin', { pluginName });
                return;
            }

            if (!plugin.instance.initialized) {
                plugin.instance.init();
                plugin.instance.onEvent(event => controller.controllerServerChannel.broadcast(plugin.instance.type, event));
            }
        })
        .catch(e => console.error('Unable to load plugin module', e));
}

function deactivateOnController(pluginName: string): Promise<void> {
    return loadPluginModule(pluginName)
        .then(plugin => plugin?.instance.unload())
        .catch(e => console.error('Unable to unload plugin module', e));
}

function activateOnComponent(pluginName: string, component: TCComponent): Promise<void> {
    return loadPluginModule(pluginName)
        .then(plugin => {
            if (!plugin) return;
            if (!plugin.instance.initialized) {
                plugin.instance.init();
                plugin.instance.onEvent((type, event) => component.controllerComponentChannel.broadcast(type, event));
            }
        })
        .catch(e => console.error('Unable to load plugin module', e));
}

export default { activateOnController, deactivateOnController, activateOnComponent };
