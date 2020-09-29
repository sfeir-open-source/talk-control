'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TCComponent } from '@client/tc-component/tc-component';
import { activatePluginOnComponent } from '@services/plugin';

/**
 * Class to use plugins with SlideView component, and have access to eventBusComponent.
 */
export class SlideViewTCComponent extends TCComponent {
    init() {
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'activatePlugin', ({ pluginName }) => activatePluginOnComponent(pluginName, this));
    }
}
