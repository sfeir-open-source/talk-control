'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

export class TCComponentLoaderComponent extends EventBusComponent {
    constructor(loader) {
        super();
        this.loader = loader;
    }

    init() {
        this.loader.showSuccess();
    }

    error() {
        this.loader.showError();
    }
}
