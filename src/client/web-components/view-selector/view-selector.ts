import { bulmaStyles, faStyles } from '@compat/lit-styles-compat';
import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faChalkboard, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

class ViewSelectorComponent extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [bulmaStyles, faStyles];
    }

    render() {
        return html`
            <div class="columns">
                <div class="column is-one-fifth">
                    <a href="on-stage.html">
                        <div id="onStageButton" class="card">
                            <div class="card-content has-text-centered">
                                <p class="title">${unsafeHTML(icon(faChalkboard).html[0])}</p>
                                <p class="subtitle">Stage view</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="column is-one-fifth is-hidden-tablet">
                    <!-- Mobile version -->
                    <a href="presenter-mobile.html">
                        <div class="card">
                            <div class="card-content has-text-centered" onclick="window.location.href = 'presenter-mobile.html'">
                                <p class="title">${unsafeHTML(icon(faChalkboardTeacher).html[0])}</p>
                                <p class="subtitle">Presenter view</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="column is-one-fifth is-hidden-mobile">
                    <!-- Desktop version -->
                    <a href="presenter.html">
                        <div class="card">
                            <div class="card-content has-text-centered" onclick="window.location.href = 'presenter.html'">
                                <p class="title">${unsafeHTML(icon(faChalkboardTeacher).html[0])}</p>
                                <p class="subtitle">Presenter view</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }
}

customElements.define('tc-view-selector', ViewSelectorComponent);
