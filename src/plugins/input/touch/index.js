const plugin = {
    usedByAComponent: true,
    type: 'inputEvent',
    _touchPosition: {
        touchstart: { clientX: 0, clientY: 0 },
        touchend: { clientX: 0, clientY: 0 }
    },
    callbacks: [],

    init() {
        addEventListener('touchstart', this._captureTouchEvent.bind(this), false);
        addEventListener('touchend', e => this._captureTouchEvent.bind(this)(e, true), false);
    },

    onEvent(callback) {
        this.callbacks.push(callback);
    },

    _captureTouchEvent(event, forward = false) {
        this._touchPosition[event.type] = {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY
        };

        if (forward) {
            // this.eventBusSlave.emit(MASTER_SLAVE_CHANNEL, 'touchEvent', { position: this._touchPosition });
            let action = '';
            for (const callBackMethod of this.callbacks) {
                callBackMethod(this.type, { key: action });
            }
        }
    }
};

export const instance = plugin;
