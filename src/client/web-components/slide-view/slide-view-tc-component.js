'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { EventBusComponent } from '@event-bus/event-bus-component';
import pluginServices from '@services/plugin';

/**
 * Class to use plugins with SlideView component, and have access to eventBusComponent.
 */
export class SlideViewTCComponent extends EventBusComponent {
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'activatePlugin', ({ pluginName }) =>
            pluginServices.activatePluginOnComponent(pluginName, this)
        );
    }
}
