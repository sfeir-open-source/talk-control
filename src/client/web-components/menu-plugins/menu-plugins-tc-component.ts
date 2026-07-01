import { EventBusComponent } from '@event-bus/event-bus-component';

interface MenuPluginsHost {
    addItemToMenu(pluginName: string): void;
    showMenu(): void;
}

export class MenuPluginsTCComponent extends EventBusComponent {
    menuPlugins: MenuPluginsHost;

    constructor(menuPlugins: MenuPluginsHost) {
        super();
        this.menuPlugins = menuPlugins;
    }

    override init(): void {
        this.controllerComponentChannel.on('addToPluginsMenu', (data: unknown) => {
            const { pluginName } = data as { pluginName: string };
            this.menuPlugins.addItemToMenu(pluginName);
        });
        this.controllerComponentChannel.on('deactivatePlugin', () => this.menuPlugins.showMenu());
    }

    startPlugin(pluginName: string): void {
        this.controllerComponentChannel.broadcast('pluginStartingIn', { pluginName });
    }

    endPlugin(pluginName: string): void {
        this.controllerComponentChannel.broadcast('pluginEndingIn', { pluginName });
    }
}
