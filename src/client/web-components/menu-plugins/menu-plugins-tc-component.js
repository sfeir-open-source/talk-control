'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class MenuPluginsTCComponent extends EventBusComponent {
    constructor(menuPlugins) {
        super();
        this.menuPlugins = menuPlugins;
    }

    init() {
        this.channel.on('addToPluginsMenu', ({ pluginName }) => this.menuPlugins.addItemToMenu(pluginName));
        this.channel.on('deactivatePlugin', () => this.menuPlugins.showMenu());
    }

    startPlugin(pluginName) {
        this.channel.broadcast('pluginStartingIn', { pluginName });
    }

    endPlugin(pluginName) {
        this.channel.broadcast('pluginEndingIn', { pluginName });
    }
}
