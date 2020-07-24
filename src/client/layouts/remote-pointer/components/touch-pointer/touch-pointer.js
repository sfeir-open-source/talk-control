import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import '../../../common/slide-view/slide-view';
import { TouchPointerSlave } from './touch-pointer-slave';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

const layerWidth = css`800`;
const layerHeight = css`450`;

class TouchPointerComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyle,
            css`
                :host {
                    --size-button:40px;
                }
                .colorButton {
                    width: var(--size-button);
                    height: var(--size-button);
                    border-radius : var(--size-button);
                    box-shadow : 5px 5px 5px 0 #C0C0C0;
                }
                #captionArea ol {
                    margin-left: 2rem;
                    padding: 0 0 1rem 0;
                }
                #slideArea {
                    position: relative;
                    width: ${layerWidth}px;
                    height: ${layerHeight}px
                }
                #touchMask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0.8;
                    width: 100%;
                    height: 100%
                }
            `
        ];
    }

    static get properties() {
        return {
            presentationUrl: { type: String },
            pointerColor: { type: String }
        };
    }

    constructor() {
        super();
        this.presentationUrl = '';
        this.pointerColor = '#FF00000';
    }

    firstUpdated() {
        super.firstUpdated();
        this._initPresentationUrl();
        this._initColorsButtons();
        
        const touchPointerSlave = new TouchPointerSlave();
        this._initPointerDblClick();
        this._initPointerMove(touchPointerSlave);
    }

    render() {
        return html`
            <div id="captionArea" class="has-background-white-ter">
                <h1 class="title">Remote pointer</h1>
                <ol>
                    <li>Choose the color pointer:
                        <div class="buttons">
                            <button class="button colorButton is-danger" value="#FF0000"></button>
                            <button class="button colorButton is-white" value="#FFFFFF"></button>
                            <button class="button colorButton is-black" value="#000000"></button>
                            <button class="button colorButton is-link" value="#0000FF"></button>
                        </div>
                    </li>
                    <li>Drag your finger on the preview area to show the pointer</li>
                </ol>
            </div>
            <div id="slideArea" class="has-background-info">
                <tc-slide url="${this.presentationUrl}"></tc-slide>
                <div id="touchMask" class="has-background-success"/>
            </div>
        `;
    }


    _initPresentationUrl() {
        this.presentationUrl = sessionStorage.getItem('presentationUrl');
    }

    _initColorsButtons() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        for (const button of buttons) {
            button.addEventListener('click', e => this._chooseColor(e.target.value));
        }
    }

    _chooseColor(color) {
        this.pointerColor = color;
    }

    _initPointerDblClick() {
        this.shadowRoot.getElementById('touchMask').addEventListener('dblclick', e => {
            const percentX = this._getPositionInPercent(e.layerX, layerWidth);
            const percentY = this._getPositionInPercent(e.layerY, layerHeight);

            console.log('Double click on position', { x: `${percentX}%`, y: `${percentY}%` });
        });
    }

    _initPointerMove(touchPointerSlave) {
        this.shadowRoot.getElementById('touchMask').addEventListener('mousemove', e => {
            const percentX = this._getPositionInPercent(e.layerX, layerWidth);
            const percentY = this._getPositionInPercent(e.layerY, layerHeight);
    
            touchPointerSlave.sendPointerPositionToMaster({ x: `${percentX}%`, y: `${percentY}%`, color: this.pointerColor });
        });
    }

    _getPositionInPercent(value, size) {
        return Math.round((value * 100) / size);
    };
}

customElements.define('tc-touch-pointer', TouchPointerComponent);
