'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TCComponent } from '@client/tc-component/tc-component';

/**
 * Class to use plugins with SlideView component, and have access to eventBusComponent.
 */
export class MenuPluginsTCComponent extends TCComponent {
    constructor() {
        super();
    }

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
