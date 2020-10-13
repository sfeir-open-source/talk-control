import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import { TouchPointerMaskTCComponent } from './touch-pointer-mask-tc-component';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

class TouchPointerMaskComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyles,
            css`
                #touchMask {
                    width: 100%;
                    height: 100%;
                    border: 4px solid red;
                }
            `
        ];
    }

    static get properties() {
        return {
            pointer: { type: Object },
            touchPointerMaskTCComponent: { type: Object }
        };
    }

    constructor() {
        super();
        this.pointer = { x: 0, y: 0, color: '#FF00000' };
        this.touchPointerMaskTCComponent;
    }

    firstUpdated() {
        super.firstUpdated();
        this.touchPointerMaskTCComponent = new TouchPointerMaskTCComponent();
        this._initPointerDblClick();
        this._initPointerMove();
    }

    render() {
        return html`
            <div id="touchMask" />
        `;
    }

    _initPointerDblClick() {
        this.shadowRoot.getElementById('touchMask').addEventListener('click', () =>
            this.touchPointerMaskTCComponent.sendPointerEventToController({
                origin: 'touchPointer',
                type: 'pointerClick',
                payload: { x: this.pointer.x, y: this.pointer.y }
            })
        );
    }

    _initPointerMove() {
        const touchMask = this.shadowRoot.getElementById('touchMask');
        const movePointer = (x, y) => {
            this.pointer.x = `${this._getPositionInPercent(x, touchMask.offsetWidth)}%`;
            this.pointer.y = `${this._getPositionInPercent(y, touchMask.offsetHeight)}%`;

            this.touchPointerMaskTCComponent.sendPointerEventToController({
                origin: 'touchPointer',
                type: 'pointerMove',
                payload: { x: this.pointer.x, y: this.pointer.y }
            });
        };

        touchMask.addEventListener('mousemove', e => {
            const x = e.layerX;
            const y = e.layerY;

            movePointer(x, y);
        });
        touchMask.addEventListener('touchmove', e => {
            const touch = e.changedTouches.length ? e.changedTouches[0] : null;
            if (touch) {
                const rect = touch.target.getBoundingClientRect();
                const x = touch.pageX - rect.left;
                const y = touch.pageY - rect.top;

                movePointer(x, y);
            }
        });
    }

    _getPositionInPercent(value, size) {
        return Math.round((value * 100) / size);
    }
}

customElements.define('tc-touch-pointer-mask', TouchPointerMaskComponent);
