'use strict';

import { EventBusComponent } from '@event-bus/event-bus-component';
import { EngineResolver } from '../engines/engine-resolver';
import pluginServices from '@services/plugin';

/**
 * @class TCComponent
 */
export class TCComponent extends EventBusComponent {
    constructor(params = {}) {
        super();
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName);
        this.shadowRoot = params.shadowRoot || undefined;
        this.channel.on('ping', () => this.channel.broadcast('pong'));
    }

    init() {
        if (this.engine) {
            this.engine.init();
        }

        // Send the total slide number
        const slides = this.engine.getSlides();
        this.channel.on('gotoSlide', data => {
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.channel.broadcast('sendNotesToController', this.engine.getSlideNotes());
            }
        });

        this.channel.on('activatePlugin', ({ pluginName }) => pluginServices.activatePluginOnComponent(pluginName, this));

        // Broadcast the initialized event only on the 'main' tc-component
        if (!this.delta) {
            this.channel.broadcast('initialized', { slides });
        }
    }
}
