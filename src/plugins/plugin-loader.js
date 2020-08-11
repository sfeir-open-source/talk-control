export function loadPluginModule(name) {
    switch (name) {
        case 'keyboardInput':
            return import('./input/keyboard/index');
        case 'touchInput':
            return import('./input/touch/index');
        case 'touchPointerInput':
            return import('./input/touch-pointer/index');
        default:
            return Promise.resolve();
    }
};
