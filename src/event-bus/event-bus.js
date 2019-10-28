const NO_KEY_PROVIDED = 'No key provided';

/**
 * @classdesc Event bus implementation
 * @class
 */
export class EventBus {
    constructor() {
        this.callBacks = {};
    }

    /**
     * Register a callback on a key
     *
     * @param {string} key - Event key to which attach the callback
     * @param {*} callback - Function to call when key event is fired
     * @throws Will throw an error if key is not specified
     */
    on(key, callback) {
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

    /**
     * Emit data for each callback registered on given event key
     *
     * @param {string} key - Event key to fire
     * @param {any} data - Data to emit
     * @throws Will throw an error if key is not specified
     */
    emit(key, data) {
        if (!key) {
            throw new Error(NO_KEY_PROVIDED);
        }
        const callbacks = this.callBacks[key];

        if (!callbacks) {
            console.warn(`No call back for key : ${key}`);
            return;
        }

        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error(e);
            }
        });
    }

    /**
     * Return all callbacks registered on the given event key
     *
     * @param {string} key - Event key from which extract callbacks
     * @returns {any[]} - The array of callbacks attached on the event key
     * @throws Will throw an error if key is not specified
     */
    getCallbacks(key) {
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
