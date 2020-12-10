'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';

/**
 * Class to use plugins with SlideView component, and have access to eventBusComponent.
 */
export class LoaderTCComponent extends EventBusComponent {
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
