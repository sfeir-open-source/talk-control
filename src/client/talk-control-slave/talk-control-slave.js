'use strict';

import { EventBusResolver, MASTER_SLAVE_CHANNEL } from '@event-bus/event-bus-resolver';
import { EngineResolver } from '../engines/engine-resolver';
import { loadPluginModule } from '@plugins/plugin-loader';

/**
 * @class TalkControlSlave
 */
export class TalkControlSlave {
    constructor(params = {}) {
        this.eventBusSlave = new EventBusResolver({
            postMessage: {
                slave: true
            }
        });
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName);
        this.shadowRoot = params.shadowRoot || undefined;
        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'init', this.init.bind(this));
        this._touchPosition = {
            touchstart: { clientX: 0, clientY: 0 },
            touchend: { clientX: 0, clientY: 0 }
        };
    }

    init() {
        if (this.engine) {
            this.engine.init();
        }
        // Send the total slide number
        const slides = this.engine.getSlides();
        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'gotoSlide', data => {
            this.engine.goToSlide(data.slide, this.delta);
            if (!this.delta) {
                this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'sendNotesToMaster', this.engine.getSlideNotes());
            }
        });

        this.eventBusSlave.on(MASTER_SLAVE_CHANNEL, 'registerPlugin', ({ pluginName }) => {
            loadPluginModule(pluginName)
                .then(plugin => {
                    plugin.instance.init(this.shadowRoot);
                    plugin.instance.onEvent((type, event) => this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, type, event));
                })
                .catch(e => {
                    console.error('Unable to load plugin module', e);
                });
        });

        // Emit the initialized event only on the 'main' slave
        if (!this.delta) this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'initialized', { slides });
    }
}
