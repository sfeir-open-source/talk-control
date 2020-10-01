// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html } from 'lit-element';

// Extend the LitElement base class
class MenuNavigation extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [
            bulmaStyles
        ];
    }

    constructor() {
        super();
    }

    firstUpdated() {
        super.firstUpdated();
        this.shadowRoot.getElementById('menuButton').addEventListener('click', () => {
            this.shadowRoot.getElementById('menuDropdown').classList.toggle('is-active');
        });
    }

    render() {
        return html`
            <div id="menuDropdown" class="dropdown">
                <div class="dropdown-trigger">
                    <button id="menuButton" class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span class="is-hidden-tablet">M</span>
                        <span class="is-hidden-mobile">Navigation</span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                        <a href="../../tc-controller/index.html" class="dropdown-item">
                            Accueil
                        </a>
                        <a href="../on-stage/on-stage.html" class="dropdown-item">
                            On stage view
                        </a>
                        <a href="../presenter/presenter.html" class="dropdown-item is-hidden-mobile">
                            Presenter view
                        </a>
                        <a href="../presenter/presenter-mobile.html" class="dropdown-item is-hidden-tablet">
                            Presenter view
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}
// Register the new element with the browser.
customElements.define('tc-menu-navigation', MenuNavigation);
