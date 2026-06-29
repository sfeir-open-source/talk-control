import config from '@config/config.json';
import { LitElement, html } from 'lit-element';
import { isValidUrl } from '@services/url';
import contextService from '@services/context';
import { bulmaStyles } from '@compat/lit-styles-compat';

class UrlFormComponent extends LitElement {
    static get styles() {
        return [bulmaStyles];
    }

    firstUpdated(): void {
        const presentationUrl = this.shadowRoot!.getElementById('presentationUrl') as HTMLInputElement;
        const validateButton = this.shadowRoot!.getElementById('validateButton')!;
        const updateButton = this.shadowRoot!.getElementById('updateButton')!;
        const urlError = this.shadowRoot!.getElementById('urlError')!;

        presentationUrl.addEventListener('keypress', e => {
            const key = (e as KeyboardEvent).which || (e as KeyboardEvent).keyCode;
            if (key === 13) {
                validateUrl();
            }
        });
        validateButton.addEventListener('click', () => validateUrl());

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
            (this.shadowRoot!.getElementById('updateButton') as HTMLElement).classList.add('is-hidden');
            (this.shadowRoot!.getElementById('validateButton') as HTMLElement).classList.remove('is-hidden');
            (this.shadowRoot!.getElementById('presentationUrl') as HTMLInputElement).disabled = false;
        };

        const switchToReadOnly = () => {
            (this.shadowRoot!.getElementById('validateButton') as HTMLElement).classList.add('is-hidden');
            (this.shadowRoot!.getElementById('updateButton') as HTMLElement).classList.remove('is-hidden');
            (this.shadowRoot!.getElementById('presentationUrl') as HTMLInputElement).disabled = true;
        };

        const hideUrlError = () => urlError.classList.add('is-hidden');
        const showUrlError = () => urlError.classList.remove('is-hidden');
    }

    render() {
        const isRemote = contextService.isUsingRemoteUrl(window.location.href);

        return html`
            <section>
                <div class="container">
                    <p class="subtitle">Enter your presentation url:</p>

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
                        <button class="delete" @click="${() => this.shadowRoot!.getElementById('urlError')!.classList.add('is-hidden')}"></button>
                        URL is not valid
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('tc-url-form', UrlFormComponent);
