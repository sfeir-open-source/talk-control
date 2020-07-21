import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';
import '../../../common/slide-view/slide-view';

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

        // Get presentation url from session storage
        this.presentationUrl = sessionStorage.getItem('presentationUrl');

        // Init double click event
        this.shadowRoot.getElementById('touchMask').addEventListener('dblclick', e => {
            const percentX = this._getPositionInPercent(e.layerX, layerWidth);
            const percentY = this._getPositionInPercent(e.layerY, layerHeight);

            console.log('Double click on position', { x: `${percentX}%`, y: `${percentY}%` });
        });

        // Init double mouse move event
        this.shadowRoot.getElementById('touchMask').addEventListener('mousemove', e => {
            const percentX = this._getPositionInPercent(e.layerX, layerWidth);
            const percentY = this._getPositionInPercent(e.layerY, layerHeight);
    
            console.log('Move pointer =>', { x: `${percentX}%`, y: `${percentY}%`, color: this.pointerColor });
        });
    }

    render() {
        return html`
            <div id="captionArea" class="has-background-white-ter">
                <h1 class="title">Remote pointer</h1>
                <ol>
                    <li>Choose the color pointer:
                        <div class="buttons">
                            <button class="button colorButton is-danger"></button>
                            <button class="button colorButton is-white"></button>
                            <button class="button colorButton is-black"></button>
                            <button class="button colorButton is-link"></button>
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

    _getPositionInPercent(value, size) {
        return Math.round((value * 100) / size);
    };
}

customElements.define('tc-touch-pointer', TouchPointerComponent);
