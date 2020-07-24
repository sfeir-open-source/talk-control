// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { SlideViewSlave } from './slide-view-slave';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html, css } from 'lit-element';

// Extend the LitElement base class
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
            bulmaStyle,
            css`
                iframe,
                section {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                #pointer {
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    width: 12px;
                    height: 12px;
                    border-radius: 6px;
                    background-color: #FF0000
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
        new SlideViewSlave();
        addEventListener('message', message => {
            if (!message || !message.data) {
                return;
            }
            // 'notesReceived' event is fired by the NotesSlave
            if (typeof message.data === 'object' && message.data.type === 'pointerPositionReceived') {
                this.shadowRoot.getElementById('pointer').style.left = message.data.pointer.x;
                this.shadowRoot.getElementById('pointer').style.top = message.data.pointer.y;
                this.shadowRoot.getElementById('pointer').style.backgroundColor = message.data.pointer.color;
            }
        });
    }

    attributeChangedCallback(name, oldval, newval) {
        super.attributeChangedCallback(name, oldval, newval);

        if (newval && (name === 'url' || (this.url && name === 'delta'))) {
            const iframe = this.shadowRoot.querySelector('iframe');
            let src = `${this.url}#delta=${this.delta}`;
            if (this.focus) {
                src += '&focus';
            }
            iframe.src = src;
            iframe.classList.remove('is-hidden');
        }
    }

    render() {
        return html`
            <section style="width: ${this.fullscreen ? '100vw' : '100%'}; height: ${this.fullscreen ? '100vh' : '100%'}">
                <iframe>Current slide</iframe>
                <div id="pointer"/>
            </section>
        `;
    }
}
// Register the new element with the browser.
customElements.define('tc-slide', SlideView);
