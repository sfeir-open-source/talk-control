'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';
import pluginServices from '@services/plugin';

export class SlideViewTCComponent extends EventBusComponent {
    init() {
        this.channel.on('activatePlugin', ({ pluginName }) => pluginServices.activatePluginOnComponent(pluginName, this));
    }
}
