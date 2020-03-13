// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import config from '@config/config';
import { LitElement, html } from 'lit-element';
import { isUrlValid } from '../../../../common/helpers/helpers';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

// Extend the LitElement base class
class UrlForm extends LitElement {
    static get styles() {
        return [bulmaStyle];
    }

    firstUpdated() {
        super.firstUpdated();
        const presentationUrl = this.shadowRoot.getElementById('presentationUrl');
        const validateButton = this.shadowRoot.getElementById('validateButton');
        const updateButton = this.shadowRoot.getElementById('updateButton');
        const urlError = this.shadowRoot.getElementById('urlError');

        // Presentation url field validation
        presentationUrl.addEventListener('keypress', e => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                validateUrl();
            }
        });
        validateButton.addEventListener('click', () => validateUrl());

        // Update button click
        updateButton.addEventListener('click', () => {
            dispatchEvent(new CustomEvent('url-form-editing'));
            switchToEdition();
        });

        const validateUrl = () => {
            const url = presentationUrl.value;

            hideUrlError();
            if (!isUrlValid(url)) {
                showUrlError();
                return;
            }

            sessionStorage.setItem('presentationUrl', url);
            dispatchEvent(new CustomEvent('url-form-validated'));
            switchToReadOnly();
        };

        const switchToEdition = () => {
            this.shadowRoot.getElementById('updateButton').classList.add('is-hidden');
            this.shadowRoot.getElementById('validateButton').classList.remove('is-hidden');
            this.shadowRoot.getElementById('presentationUrl').disabled = false;
        };

        const switchToReadOnly = () => {
            this.shadowRoot.getElementById('validateButton').classList.add('is-hidden');
            this.shadowRoot.getElementById('updateButton').classList.remove('is-hidden');
            this.shadowRoot.getElementById('presentationUrl').disabled = true;
        };

        const hideUrlError = () => urlError.classList.add('is-hidden');
        const showUrlError = () => urlError.classList.remove('is-hidden');
    }

    render() {
        const isRemote = window.location.href.indexOf('://localhost:') === -1;

        return html`
            <section>
                <div class="container">
                    <p class="subtitle">
                        Enter your presentation url:
                    </p>
                    <!-- Enter presentation url form area -->
                    <div class="columns">
                        <div class="column is-half">
                            <input
                                class="input"
                                type="url"
                                placeholder="Enter the url of your presentation : http://my.presentation.url/index.html"
                                id="presentationUrl"
                                value="${isRemote ? config.tcShowcase.urls.external : config.tcShowcase.urls.local}"
                            />
                        </div>
                        <div class="column">
                            <button id="validateButton" class="button">Validate</button>
                            <button id="updateButton" class="button is-hidden">Edit</button>
                        </div>
                    </div>

                    <!-- Error message area -->
                    <div id="urlError" class="notification is-danger is-hidden">
                        <button class="delete" @click="${() => this.shadowRoot.getElementById('urlError').classList.add('is-hidden')}"></button>
                        URL is not valid
                    </div>
                </div>
            </section>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-url-form', UrlForm);
