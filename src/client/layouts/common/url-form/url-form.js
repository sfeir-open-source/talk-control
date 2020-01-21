// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
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
        const inputPresentation = this.shadowRoot.getElementById('inputPresentation');
        const validateButton = this.shadowRoot.getElementById('btnValidate');
        const validateForm = () => {
            const url = inputPresentation.value;
            // If url invalid, show an error
            this.shadowRoot.getElementById('urlError').classList.add('is-hidden');
            if (!isUrlValid(url)) {
                this.shadowRoot.getElementById('urlError').classList.remove('is-hidden');
                return;
            }
            const urlChangedEvent = new CustomEvent('url-changed', {
                detail: {
                    url
                }
            });
            dispatchEvent(urlChangedEvent);
        };
        // Start validation when button cliked or 'enter' pressed
        validateButton.addEventListener('click', validateForm);
        inputPresentation.addEventListener('keypress', e => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                validateForm();
            }
        });
    }

    render() {
        return html`
            <section class="section">
                <div class="container">
                    <h1 class="title">
                        Talk control
                    </h1>
                    <p class="subtitle">
                        Take control of your presentation by entering its url below
                    </p>
                    <!-- Enter presentation url form area -->
                    <div class="columns">
                        <div class="column is-half">
                            <div class="columns">
                                <div class="column is-four-fifths">
                                    <input
                                        class="input"
                                        type="url"
                                        placeholder="Enter the url of your presentation : http://my.presentation.url/index.html"
                                        id="inputPresentation"
                                        value="http://127.0.0.1:5000"
                                    />
                                </div>
                                <div class="column">
                                    <button id="btnValidate" class="button">Validate Url</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Error message area -->
                    <div class="columns">
                        <div class="column is-half">
                            <div id="urlError" class="notification is-danger is-hidden">
                                <button class="delete" @click="${() => this.shadowRoot.getElementById('urlError').classList.add('is-hidden')}"></button>
                                URL is not valid
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
// Register the new element with the browser.
customElements.define('tc-url-form', UrlForm);
