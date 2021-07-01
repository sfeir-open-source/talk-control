import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html } from 'lit-element';
import Fontawesome from 'lit-fontawesome';
import { config } from '@services/config';
const QRCode = require('qrcode');

class RemoteControlComponent extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [bulmaStyles, Fontawesome];
    }

    firstUpdated() {
        if (config.tcController.urls.external) {
            QRCode.toCanvas(this.shadowRoot.getElementById('qrCode'), config.tcController.urls.external);
            this.shadowRoot.getElementById(
                'textCode'
            ).innerHTML = `<a href="${config.tcController.urls.external}" title="Use this url to connect to TalkControl from another device">${config.tcController.urls.external}</a>`;
        } else {
            this.shadowRoot.getElementById('qrCodeSection').classList.add('is-hidden');
        }
    }

    render() {
        return html`
            <div id="qrCodeSection">
                <h2 class="subtitle">
                    Or take control from another device
                </h2>
                <div class="columns">
                    <div class="column is-one-third">
                        <div class="card">
                            <div class="card-content has-text-centered">
                                <canvas id="qrCode" aria-label="Use this QRCode to connect to TalkControl from your mobile"></canvas><br />
                                <span id="textCode"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('tc-remote-control', RemoteControlComponent);
