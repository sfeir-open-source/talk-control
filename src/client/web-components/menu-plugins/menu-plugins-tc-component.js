'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { EventBusComponent } from '@event-bus/event-bus-component';

/**
 * Class to use plugins with SlideView component, and have access to eventBusComponent.
 */
export class MenuPluginsTCComponent extends EventBusComponent {
    constructor(menuPlugins) {
        super();
        this.menuPlugins = menuPlugins;
    }
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'addToPluginsMenu', ({ pluginName }) => this.menuPlugins.addItemToMenu(pluginName));
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'deactivatePlugin', () => this.menuPlugins.showMenu());
    }

    startPlugin(pluginName) {
        this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginStartingIn', { pluginName });
    }

    endPlugin(pluginName) {
        this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pluginEndingIn', { pluginName });
    }
}
