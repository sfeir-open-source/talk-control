'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';
import pluginServices from '@services/plugin';

export class SlideViewTCComponent extends EventBusComponent {
    constructor(slideView) {
        super();
        this.slideView = slideView;
        SlideViewTCComponent.count = SlideViewTCComponent.count || { slides: 0, loadedSlides: 0 };
        SlideViewTCComponent.count.slides++;

        this.channel.on('loadPresentation', url => {
            this.slideView.url = url;
            SlideViewTCComponent.count.loadedSlides = 0;
        });
    }

    init() {
        this.channel.on('activatePlugin', ({ pluginName }) => pluginServices.activatePluginOnComponent(pluginName, this));
    }

    setLoaded() {
        SlideViewTCComponent.count.loadedSlides++;
        if (SlideViewTCComponent.count.slides === SlideViewTCComponent.count.loadedSlides) {
            this.channel.broadcast('presentationLoaded');
        }
    }
}
