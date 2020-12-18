'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';
import pluginServices from '@services/plugin';

export class SlideViewTCComponent extends EventBusComponent {
    constructor(slideView) {
        super();
        this.slideView = slideView;

        this.channel.on('loadPresentation', url => {
            this.slideView.url = url;
            this.channel.broadcast('slideLoading');
        });
    }

    init() {
        this.channel.on('activatePlugin', ({ pluginName }) => pluginServices.activatePluginOnComponent(pluginName, this));
    }

    setLoaded() {
        this.channel.broadcast('slideLoaded');
    }
}
