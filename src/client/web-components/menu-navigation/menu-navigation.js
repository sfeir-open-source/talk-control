// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html } from 'lit-element';
import Fontawesome from 'lit-fontawesome';

// Extend the LitElement base class
class MenuNavigationComponent extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [bulmaStyles, Fontawesome];
    }

    constructor() {
        super();
    }

    firstUpdated() {
        this.shadowRoot.getElementById('menuButton').addEventListener('click', () => {
            this.shadowRoot.getElementById('menuDropdown').classList.toggle('is-active');
        });
    }

    render() {
        return html`
            <div id="menuDropdown" class="dropdown">
                <div class="dropdown-trigger">
                    <button id="menuButton" class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span class="is-hidden-tablet"><i class="fas fa-bars"></i></span>
                        <span class="is-hidden-mobile"><i class="fas fa-bars"></i> Navigation</span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                        <a href="index.html" class="dropdown-item"> <i class="fas fa-home"></i> Home </a>
                        <a href="on-stage.html" class="dropdown-item"> <i class="fas fa-desktop"></i> On stage view </a>
                        <a href="presenter.html" class="dropdown-item is-hidden-mobile"> <i class="fas fa-chalkboard-teacher"></i> Presenter view </a>
                        <a href="presenter-mobile.html" class="dropdown-item is-hidden-tablet"> <i class="fas fa-mobile-alt"></i> Presenter view </a>
                    </div>
                </div>
            </div>
        `;
    }
}
// Register the new element with the browser.
customElements.define('tc-menu-navigation', MenuNavigationComponent);
