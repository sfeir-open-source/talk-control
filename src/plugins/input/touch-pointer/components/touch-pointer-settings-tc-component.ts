import { EventBusComponent } from '@event-bus/event-bus-component';

export class TouchPointerSettingsTCComponent extends EventBusComponent {
    override init(): void {
        this.controllerComponentChannel.on('touchPointer', () => postMessage);
    }

    sendPointerEventToController(eventData: unknown): void {
        this.controllerComponentChannel.broadcast('pluginEventIn', eventData);
    }
}
