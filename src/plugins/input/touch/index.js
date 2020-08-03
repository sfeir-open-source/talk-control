const plugin = {
    usedByAComponent: true,
    type: 'inputEvent',
    touchPosition: {
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
        this.touchPosition[event.type] = {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY
        };

        if (forward) {
            const xDiff = this.touchPosition.touchstart.clientX - this.touchPosition.touchend.clientX;
            const yDiff = this.touchPosition.touchstart.clientY - this.touchPosition.touchend.clientY;
            const xDiffPositive = xDiff < 0 ? xDiff * -1 : xDiff;
            const yDiffPositive = yDiff < 0 ? yDiff * -1 : yDiff;
            let action = '';
            
            if (xDiffPositive <= 20 && yDiffPositive <= 20) {
                action = 'space';
            } else if (xDiffPositive > yDiffPositive) {
                action = xDiff > 0 ? 'arrowRight' : 'arrowLeft';
            } else if (yDiffPositive >= xDiffPositive) {
                action = yDiff > 0 ? 'arrowDown' : 'arrowUp';
            }
            
            for (const callBackMethod of this.callbacks) {
                callBackMethod(this.type, { key: action });
            }
        }
    }
};

export const instance = plugin;
