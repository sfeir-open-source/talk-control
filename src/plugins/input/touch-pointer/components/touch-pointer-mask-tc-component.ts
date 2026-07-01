import { EventBusComponent } from '@event-bus/event-bus-component';

export class TouchPointerMaskTCComponent extends EventBusComponent {
    override init(): void {
        this.controllerComponentChannel.on('touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData: unknown): void {
        this.controllerComponentChannel.broadcast('pluginEventIn', eventData);
    }
}
