import { LitElement, html, css, PropertyValues } from 'lit-element';
import { TouchPointerSettingsTCComponent } from './touch-pointer-settings-tc-component';
import { bulmaStyles } from '@compat/lit-styles-compat';

class TouchPointerSettingsComponent extends LitElement {
    pointerColor = '#FF00000';
    touchPointerSettingsTCComponent!: TouchPointerSettingsTCComponent;

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

    override firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
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

    _initColorsButtons(): void {
        const buttons = this.shadowRoot!.querySelectorAll('button');
        for (const button of buttons) {
            button.addEventListener('click', e => this._chooseColor((e.target as HTMLButtonElement).value));
        }
    }

    _chooseColor(color: string): void {
        this.pointerColor = color;
        this.touchPointerSettingsTCComponent.sendPointerEventToController({
            origin: 'touchPointer',
            type: 'pointerColor',
            payload: { color: this.pointerColor }
        });
    }
}

customElements.define('tc-touch-pointer-settings', TouchPointerSettingsComponent);
