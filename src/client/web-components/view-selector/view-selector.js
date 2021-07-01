import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html } from 'lit-element';
import Fontawesome from 'lit-fontawesome';

class ViewSelectorComponent extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [bulmaStyles, Fontawesome];
    }

    render() {
        return html`
            <div class="columns">
                <div class="column is-one-fifth">
                    <a href="on-stage.html">
                        <div id="onStageButton" class="card">
                            <div class="card-content has-text-centered">
                                <p class="title">
                                    <i class="fas fa-chalkboard"></i>
                                </p>
                                <p class="subtitle">
                                    Stage view
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="column is-one-fifth is-hidden-tablet">
                    <!-- Mobile version -->
                    <a href="presenter-mobile.html">
                        <div class="card">
                            <div class="card-content has-text-centered" onclick="window.location.href = 'presenter-mobile.html'">
                                <p class="title">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                </p>
                                <p class="subtitle">
                                    Presenter view
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="column is-one-fifth is-hidden-mobile">
                    <!-- Desktop version -->
                    <a href="presenter.html">
                        <div class="card">
                            <div class="card-content has-text-centered" onclick="window.location.href = 'presenter.html'">
                                <p class="title">
                                    <i class="fas fa-chalkboard-teacher"></i>
                                </p>
                                <p class="subtitle">
                                    Presenter view
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }
}

customElements.define('tc-view-selector', ViewSelectorComponent);
