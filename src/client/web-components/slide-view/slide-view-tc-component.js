'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';
import pluginService from '@services/plugin';

export class SlideViewTCComponent extends EventBusComponent {
    constructor(slideView) {
        super();
        this.slideView = slideView;

        this.controllerComponentChannel.on('loadPresentation', url => {
            this.slideView.url = url;
            this.controllerComponentChannel.broadcast('presentationLoading');
        });
    }

    init() {
        this.controllerComponentChannel.on('activatePlugin', ({ pluginName }) => pluginService.activateOnComponent(pluginName, this));
    }

    setLoaded() {
        this.controllerComponentChannel.broadcast('presentationLoaded');
    }
}
