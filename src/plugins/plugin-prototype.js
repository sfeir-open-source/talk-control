export const pluginPrototype = {
    usedByAComponent: false,
    type: '',
    callbacks: [],

    init() {},

    onEvent(callback) {
        this.callbacks.push(callback);
    }
};
