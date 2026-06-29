export type PluginEventCallback = (type: string, event: unknown) => void;

export class Plugin {
    usedByAComponent = true;
    initialized = false;
    type = '';
    callbacks: PluginEventCallback[] = [];

    onEvent(callback: PluginEventCallback): void {
        this.callbacks.push(callback);
    }

    init(): void {}
    unload(): void {}
}
