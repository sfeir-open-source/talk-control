'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave';

/**
 * Class to use plugins with SlideView component, and have access to eventBusSlave.
 */
export class SlideViewSlave extends TalkControlSlave {
    init() {
        this.eventBusSlave.on(CONTROLLER_COMPONENT_CHANNEL, 'registerPlugin', ({ pluginName }) => this.registerPlugin(pluginName));
    }
}
