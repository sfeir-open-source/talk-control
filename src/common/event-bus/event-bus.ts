export const NO_KEY_PROVIDED = 'No key provided';
export const NO_TARGET_PROVIDED = 'No socket or window provided';
export const DUPLICATE_CALLBACKS_ENTRY = 'Duplicate entry in callbacks';

export type EventCallback = (data: unknown) => void;

export class EventBus {
    callBacks: Record<string, EventCallback[]> = {};

    onMultiple(key: string, callback: EventCallback): void {
        if (!key) {
            throw new Error(NO_KEY_PROVIDED);
        }
        let arrayCallback = this.callBacks[key];
        if (!arrayCallback) {
            arrayCallback = [];
            this.callBacks[key] = arrayCallback;
        }
        arrayCallback.push(callback);
    }

    on(key: string, callback: EventCallback): void {
        if (!key) {
            throw new Error(NO_KEY_PROVIDED);
        }

        if (this.callBacks[key]) {
            throw new Error(DUPLICATE_CALLBACKS_ENTRY);
        }

        this.callBacks[key] = [callback];
    }

    broadcast(key: string, data?: unknown): void {
        if (!key) {
            throw new Error(NO_KEY_PROVIDED);
        }
        const callbacks = this.callBacks[key];

        if (!callbacks) return;

        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error(e);
            }
        });
    }

    emitTo(key: string, data: unknown, target: unknown): void {
        if (!key) {
            throw new Error(NO_KEY_PROVIDED);
        }
        if (!target) {
            throw new Error(NO_TARGET_PROVIDED);
        }

        // Do nothing on super class
    }

    getCallbacks(key: string): EventCallback[] {
        if (!key) {
            throw new Error(NO_KEY_PROVIDED);
        }
        const arrayCallback = this.callBacks[key];
        if (!arrayCallback) {
            return [];
        }
        return arrayCallback;
    }
}
