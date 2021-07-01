// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import config from '@config/config';
import { LitElement, html } from 'lit-element';
import { isValidUrl } from '@services/url';
import contextService from '@services/context';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

// Extend the LitElement base class
class UrlFormComponent extends LitElement {
    static get styles() {
        return [bulmaStyles];
    }

    firstUpdated() {
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
            if (!isValidUrl(url)) {
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
        const isRemote = contextService.isUsingRemoteUrl(window.location.href);

        return html`
            <section>
                <div class="container">
                    <p class="subtitle">
                        Enter your presentation url:
                    </p>

                    <div class="field has-addons">
                        <div class="control">
                            <input
                                class="input"
                                type="url"
                                placeholder="http://..."
                                id="presentationUrl"
                                value="${isRemote ? config.tcShowcase.urls.external : config.tcShowcase.urls.local}"
                            />
                        </div>
                        <div class="control">
                            <a id="validateButton" class="button is-info">Validate</a>
                            <a id="updateButton" class="button is-primary is-hidden">Edit</a>
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
customElements.define('tc-url-form', UrlFormComponent);
