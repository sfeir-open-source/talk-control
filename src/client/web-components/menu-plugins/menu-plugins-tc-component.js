'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { EventBusComponent } from '@event-bus/event-bus-component';

/**
 * Class to use plugins with SlideView component, and have access to eventBusComponent.
 */
export class MenuPluginsTCComponent extends EventBusComponent {
    init(addToPluginsMenu, deactivatePlugin) {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'addToPluginsMenu', ({ pluginName }) => addToPluginsMenu(pluginName));

        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'deactivatePlugin', () => deactivatePlugin());
    }

    startPlugin(pluginName) {
        this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginStartingIn', { pluginName });
    }

    endPlugin(pluginName) {
        this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginEndingIn', { pluginName });
    }
}
