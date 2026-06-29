import { config } from '@services/config';
import { Plugin } from '@plugins/plugin.js';

class KeyboardInput extends Plugin {
    constructor() {
        super();
        this.type = 'inputEvent';
    }

    override init(): void {
        addEventListener('keyup', e => this._captureKeyboardEvent(e, true), true);
        addEventListener('keypressed', this._captureKeyboardEvent.bind(this) as EventListener, true);
        addEventListener('keydown', this._captureKeyboardEvent.bind(this), true);
        this.initialized = true;
    }

    _captureKeyboardEvent(event: KeyboardEvent, forward = false): void {
        const keys = config.tcComponent.keysBlocked;
        const activeElementIsInput = document.activeElement?.tagName && /input|textarea/i.test(document.activeElement.tagName);
        const activeEditable = document.activeElement && (document.activeElement as HTMLElement).contentEditable !== 'inherit';
        if (activeEditable || activeElementIsInput) {
            return;
        }

        if (keys.includes(event.code)) {
            event.stopPropagation();
            if (forward) {
                let action = '';
                switch (event.key) {
                    case 'Down':
                    case 'ArrowDown':
                        action = 'arrowDown';
                        break;
                    case 'Up':
                    case 'ArrowUp':
                        action = 'arrowUp';
                        break;
                    case 'Left':
                    case 'ArrowLeft':
                        action = 'arrowLeft';
                        break;
                    case 'Right':
                    case 'ArrowRight':
                        action = 'arrowRight';
                        break;
                    case 'PageUp':
                        action = 'pageUp';
                        break;
                    case 'PageDown':
                        action = 'pageDown';
                        break;
                    case ' ':
                        action = 'space';
                        break;
                }

                for (const callBackMethod of this.callbacks) {
                    callBackMethod(this.type, { key: action });
                }
            }
        }
    }
}

export const instance = new KeyboardInput();
