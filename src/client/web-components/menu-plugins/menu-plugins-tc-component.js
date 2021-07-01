'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class MenuPluginsTCComponent extends EventBusComponent {
    constructor(menuPlugins) {
        super();
        this.menuPlugins = menuPlugins;
    }

    init() {
        this.controllerComponentChannel.on('addToPluginsMenu', ({ pluginName }) => this.menuPlugins.addItemToMenu(pluginName));
        this.controllerComponentChannel.on('deactivatePlugin', () => this.menuPlugins.showMenu());
    }

    startPlugin(pluginName) {
        this.controllerComponentChannel.broadcast('pluginStartingIn', { pluginName });
    }

    endPlugin(pluginName) {
        this.controllerComponentChannel.broadcast('pluginEndingIn', { pluginName });
    }
}
