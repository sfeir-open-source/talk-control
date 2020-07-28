export async function loadPluginModule(name) {
    switch (name) {
        case 'keyboardInput':
            return await import('./input/keyboard/index');
    }
};
