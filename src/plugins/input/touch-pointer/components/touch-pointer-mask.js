import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import { TouchPointerMaskTCComponent } from './touch-pointer-mask-tc-component';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

class TouchPointerMaskComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyle,
            css`
                #touchMask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 4px solid red
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
        return html`<div id="touchMask"/>`;
    }

    _initPointerDblClick() {
        this.shadowRoot
            .getElementById('touchMask')
            .addEventListener(
                'dblclick',
                () => this.touchPointerMaskTCComponent.sendPointerEventToController({
                    origin: 'touchPointer',
                    type: 'pointerClick',
                    payload: { x: this.pointer.x, y: this.pointer.y }
                })
            );
    }

    _initPointerMove() {
        const touchMask = this.shadowRoot.getElementById('touchMask');
        touchMask.addEventListener(
            'mousemove',
            e => {
                console.log('mousemove', e);
                this.pointer.x = `${this._getPositionInPercent(e.layerX, touchMask.offsetWidth)}%`;
                this.pointer.y = `${this._getPositionInPercent(e.layerY, touchMask.offsetHeight)}%`;
        
                this.touchPointerMaskTCComponent.sendPointerEventToController({
                    origin: 'touchPointer',
                    type: 'pointerMove',
                    payload: { x: this.pointer.x, y: this.pointer.y }
                });
            }
        );
    }

    _getPositionInPercent(value, size) {
        return Math.round((value * 100) / size);
    };
}

customElements.define('tc-touch-pointer-mask', TouchPointerMaskComponent);
