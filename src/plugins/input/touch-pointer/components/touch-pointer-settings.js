import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import { TouchPointerSettingsTCComponent } from './touch-pointer-settings-tc-component';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

class TouchPointerSettingsComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyles,
            css`
                :host {
                    --size-button: 40px;
                }
                .colorButton {
                    width: var(--size-button);
                    height: var(--size-button);
                    border-radius: var(--size-button);
                    box-shadow: 5px 5px 5px 0 #c0c0c0;
                }
                #captionArea ol {
                    margin-left: 2rem;
                    padding: 0 0 1rem 0;
                }
            `
        ];
    }

    static get properties() {
        return {
            pointerColor: { type: String },
            touchPointerSettingsTCComponent: { type: Object }
        };
    }

    constructor() {
        super();
        this.pointerColor = '#FF00000';
        this.touchPointerSettingsTCComponent;
    }

    firstUpdated() {
        super.firstUpdated();
        this._initColorsButtons();

        this.touchPointerSettingsTCComponent = new TouchPointerSettingsTCComponent();
    }

    render() {
        return html`
            <div id="captionArea" class="has-background-white-ter">
                <h1 class="title">Touch pointer</h1>
                <ol>
                    <li>
                        Choose the color pointer:
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
        `;
    }

    _initColorsButtons() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        for (const button of buttons) {
            button.addEventListener('click', e => this._chooseColor(e.target.value));
        }
    }

    _chooseColor(color) {
        this.pointerColor = color;
        this.touchPointerSettingsTCComponent.sendPointerEventToController({
            origin: 'touchPointer',
            type: 'pointerColor',
            payload: { color: this.pointerColor }
        });
    }
}

customElements.define('tc-touch-pointer-settings', TouchPointerSettingsComponent);
