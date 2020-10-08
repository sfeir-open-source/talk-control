'use strict';

export class Plugin {
    constructor() {
        this.usedByAComponent = true;
        this.initialized = false;
        this.callbacks = [];
    }

    onEvent(callback) {
        this.callbacks.push(callback);
    }
}
