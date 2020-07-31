export function loadPluginModule(name) {
    switch (name) {
        case 'keyboardInput':
            return import('./input/keyboard/index');
        case 'touchInput':
            return import('./input/touch/index');
        default:
            return Promise.resolve();
    }
};
