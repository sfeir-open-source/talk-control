import { EventBusComponent } from '@event-bus/event-bus-component';
import pluginService from '@services/plugin';

interface SlideViewHost {
    url: unknown;
}

export class SlideViewTCComponent extends EventBusComponent {
    slideView: SlideViewHost;

    constructor(slideView: SlideViewHost) {
        super();
        this.slideView = slideView;

        this.controllerComponentChannel.on('loadPresentation', url => {
            this.slideView.url = url;
            this.controllerComponentChannel.broadcast('presentationLoading');
        });
    }

    override init(): void {
        this.controllerComponentChannel.on('activatePlugin', (data: unknown) => {
            const { pluginName } = data as { pluginName: string };

            pluginService.activateOnComponent(pluginName, this as any);
        });
    }

    setLoaded(): void {
        this.controllerComponentChannel.broadcast('presentationLoaded');
    }
}
