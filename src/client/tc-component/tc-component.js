'use strict';

import { EventBusResolver, CONTROLLER_COMPONENT_CHANNEL } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';
import { loadPluginModule } from '@plugins/plugin-loader';

/**
 * @class TCComponent
 */
export class TCComponent {
    constructor(params = {}) {
        this.eventBusComponent = new EventBusResolver({
            postMessage: {}
        });
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName);
        this.shadowRoot = params.shadowRoot || undefined;
        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'init', this.init.bind(this));
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

        this.eventBusComponent.on(CONTROLLER_COMPONENT_CHANNEL, 'registerPlugin', ({ pluginName }) => this.registerPlugin(pluginName));

        // Broadcast the initialized event only on the 'main' tc-component
        if (!this.delta) {
            this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, 'initialized', { slides });
        }
    }

    registerPlugin(pluginName) {
        loadPluginModule(pluginName)
            .then(plugin => {
                plugin.instance.init(this.shadowRoot);
                plugin.instance.onEvent((type, event) => this.eventBusComponent.broadcast(CONTROLLER_COMPONENT_CHANNEL, type, event));
            })
            .catch(e => {
                console.error('Unable to load plugin module', e);
            });
    }
}
