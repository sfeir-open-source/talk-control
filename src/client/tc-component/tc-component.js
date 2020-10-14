'use strict';

import { CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
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
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'ping', () => this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'pong'));
    }

    init() {
        if (this.engine) {
            this.engine.init();
        }

        // Send the total slide number
        const slides = this.engine.getSlides();
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'gotoSlide', data => {
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'sendNotesToController', this.engine.getSlideNotes());
            }
        });

        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'activatePlugin', ({ pluginName }) =>
            pluginServices.activatePluginOnComponent(pluginName, this)
        );

        // Broadcast the initialized event only on the 'main' tc-component
        if (!this.delta) {
            this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'initialized', { slides });
        }
    }
}
