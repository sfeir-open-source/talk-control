import { EventBus } from '../event-bus.js';
import { querySelectorAllDeep } from 'query-selector-shadow-dom';

export class EventBusPostMessage extends EventBus {
    windows: Window[];

    constructor(deep = false) {
        super();
        this.windows = [window.parent];
        if (deep) this.windows = [...this.windows, ...this._getFramesWindows()];

        window.addEventListener('message', this._receiveMessageWindow.bind(this), false);
    }

    broadcast(key: string, data?: unknown): void {
        super.broadcast(key, data);
        this.windows.forEach(w =>
            w.postMessage(
                {
                    type: key,
                    data
                },
                '*'
            )
        );
    }

    emitTo(key: string, data: unknown, targetWindow: Window): void {
        super.emitTo(key, data, targetWindow);

        targetWindow.postMessage(
            {
                type: key,
                data
            },
            '*'
        );
    }

    _receiveMessageWindow(message: MessageEvent): void {
        if (!message || !message.data) {
            return;
        }

        if (typeof message.data === 'object' && message.data.type) {
            const callBacks = super.getCallbacks(message.data.type as string);
            if (callBacks && callBacks.length > 0) {
                callBacks.forEach(callback => callback((message.data as { data: unknown }).data));
            }
        }
    }

    _getFramesWindows(): Window[] {
        return querySelectorAllDeep('iframe')
            .map(frame => (frame as HTMLIFrameElement).contentWindow)
            .filter((w): w is Window => w !== null);
    }
}
