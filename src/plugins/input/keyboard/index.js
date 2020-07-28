import config from '@config/config.json';
import { pluginPrototype } from '@plugins/plugin-prototype';

const plugin = {
    usedByAComponent: true,
    type: 'inputEvent',

    init() {
        addEventListener('keyup', e => this._captureKeyboardEvent.bind(this)(e, true), true);
        addEventListener('keypressed', this._captureKeyboardEvent.bind(this), true);
        addEventListener('keydown', this._captureKeyboardEvent.bind(this), true);
    },

    _captureKeyboardEvent(event, forward = false) {
        const keys = config.tcSlave.keysBlocked;
        // Check if there's a focused element that could be using the keyboard
        const activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
        if ((document.activeElement && document.activeElement.contentEditable !== 'inherit') || activeElementIsInput) {
            return;
        }

        // Check if the pressed key should be interpreted
        if (keys.includes(event.code)) {
            event.stopPropagation();
            if (forward) {
                let action = '';
                switch (event.key) {
                    case 'Down': // IE specific value
                    case 'ArrowDown':
                        action = 'arrowDown';
                        break;
                    case 'Up': // IE specific value
                    case 'ArrowUp':
                        action = 'arrowUp';
                        break;
                    case 'Left': // IE specific value
                    case 'ArrowLeft':
                        action = 'arrowLeft';
                        break;
                    case 'Right': // IE specific value
                    case 'ArrowRight':
                        action = 'arrowRight';
                        break;
                    case ' ':
                        action = 'space';
                        break;
                }

                for (let callBackMethod of this.callbacks) {
                    callBackMethod(this.type, { key: action });
                }
            }
        }
    }
};

plugin.__proto__ = pluginPrototype;

export const instance = plugin;
