// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { SlideViewTCComponent } from './slide-view-tc-component';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html, css } from 'lit-element';

class SlideView extends LitElement {
    static get properties() {
        return {
            url: { type: String, reflect: true, attribute: true },
            delta: { type: String, reflect: true, attribute: true },
            focus: { type: Boolean, reflect: true, attribute: true },
            fullscreen: { type: Boolean, reflect: true, attribute: true }
        };
    }

    static get styles() {
        return [
            bulmaStyles,
            css`
                iframe,
                section {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                section.fullscreen {
                    width: 100vw;
                    height: 100vh;
                }
            `
        ];
    }

    constructor() {
        super();
        this.url = '';
        this.delta = '0';
        this.fullscreen = false;
    }

    firstUpdated() {
        super.firstUpdated();
        this.slideViewTcComponent =  new SlideViewTCComponent(this);
    }

    attributeChangedCallback(name, oldval, newval) {
        super.attributeChangedCallback(name, oldval, newval);

        if (newval && (name === 'url' || (this.url && name === 'delta'))) {
            this._loadFrame();
        }
    }

    _loadFrame() {
        const iframe = this.shadowRoot.querySelector('iframe');
        let src = `${this.url}#delta=${this.delta}`;
        if (this.focus) {
            src += '&focus';
        }
        iframe.src = src;
        iframe.classList.remove('is-hidden');
        iframe.onload = () => this.slideViewTcComponent.setLoaded();
    }

    render() {
        return html`
            <section id="slideViewSection" class="${this.fullscreen ? 'fullscreen' : ''}">
                <iframe id="slideViewFrame">Current slide</iframe>
            </section>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-slide', SlideView);
