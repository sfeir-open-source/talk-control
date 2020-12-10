import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html, css } from 'lit-element';

class LoaderComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyles,
            css`
                :host {
                }
                .tc-loader {
                    background-color: grey;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 6px;
                    opacity: 0;
                    z-index: -1;
                }
                .tc-loader.is-active {
                    opacity: 1;
                    z-index: 1;
                }
                .loader {
                    height: 80px;
                    width: 80px;
                }
            `
        ];
    }

    constructor() {
        super();
        this._loaderMixin;
        this._tcController;
    }

    set loaderMixin(loaderMixin) {
        this._loaderMixin = loaderMixin;
        this._loaderMixin.onReady(() => {
            this.shadowRoot.querySelector('.tc-loader').classList.remove('is-active');
            this.shadowRoot.querySelector('slot[name="success"]').classList.remove('is-hidden');
        });
        this._loaderMixin.onError(() => {
            this.shadowRoot.querySelector('.tc-loader').classList.remove('is-active');
            this.shadowRoot.querySelector('slot[name="error"]').classList.remove('is-hidden');
        });
    }

    get loaderMixin() {
        return this._loaderMixin;
    }

    firstUpdated() {
        // Initialize clock
    }

    render() {
        return html`
            <div class="tc-loader is-active">
                <div class="loader is-loading"></div>
            </div>
            <slot name="success" class="is-hidden"></slot>
            <slot name="error" class="is-hidden on-error"></slot>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-loader', LoaderComponent);