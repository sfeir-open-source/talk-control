import type { Plugin } from './plugin';

export interface PluginModule {
    instance: Plugin;
}

export function loadPluginModule(name: string | undefined): Promise<PluginModule | undefined> {
    switch (name) {
        case 'keyboardInput':
            return import('./input/keyboard/index');
        case 'touchInput':
            return import('./input/touch/index');
        case 'touchPointerInput':
            return import('./input/touch-pointer/index');
        default:
            return Promise.resolve(undefined);
    }
}
