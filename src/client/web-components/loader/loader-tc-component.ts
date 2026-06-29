import { EventBusComponent } from '@event-bus/event-bus-component';

interface LoaderHost {
    showSuccess(): void;
    showError(): void;
}

export class TCComponentLoaderComponent extends EventBusComponent {
    loader: LoaderHost;

    constructor(loader: LoaderHost) {
        super();
        this.loader = loader;
    }

    override init(): void {
        this.loader.showSuccess();
    }

    override error(): void {
        this.loader.showError();
    }
}
