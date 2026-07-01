import { EventBusComponent } from '@event-bus/event-bus-component';
import { EngineResolver } from '../engines/engine-resolver';
import pluginService from '@services/plugin';
import { GenericEngine } from '../engines/generic-client-engine';

interface TCComponentParams {
    engineName?: string;
    delta?: number;
    shadowRoot?: ShadowRoot;
    [key: string]: unknown;
}

export class TCComponent extends EventBusComponent {
    delta: number;
    engine: GenericEngine;
    shadowRoot: ShadowRoot | undefined;

    constructor(params: TCComponentParams = {}) {
        super();
        this.delta = params.delta || 0;
        this.engine = EngineResolver.getEngine(params.engineName || 'revealjs');
        this.shadowRoot = params.shadowRoot || undefined;
        this.controllerComponentChannel.on('ping', () => this.controllerComponentChannel.broadcast('pong'));
    }

    override init(): void {
        if (this.engine) {
            this.engine.init();
        }

        const slides = this.engine.getSlides();
        this.controllerComponentChannel.on('gotoSlide', data => {
            const { slide } = data as { slide: unknown };
            this.engine.goToSlide(slide, this.delta);
            if (!this.delta) {
                this.controllerComponentChannel.broadcast('sendNotesToController', this.engine.getSlideNotes());
            }
        });

        this.controllerComponentChannel.on('activatePlugin', data => {
            const { pluginName } = data as { pluginName: string };
            pluginService.activateOnComponent(pluginName, this);
        });

        if (!this.delta) {
            this.controllerComponentChannel.broadcast('initialized', { slides });
        }
    }
}
