import { MenuPluginsTCComponent } from './menu-plugins-tc-component';
import { bulmaStyles, faStyles } from '@compat/lit-styles-compat';
import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faCube } from '@fortawesome/free-solid-svg-icons';

class MenuPluginsComponent extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [
            bulmaStyles,
            faStyles,
            css`
                #closeButton {
                    display: none;
                }
            `
        ];
    }

    constructor() {
        super();
        this.menuPluginsTcComponent;
        this.itemTitle = '';
    }

    firstUpdated() {
        this.shadowRoot.getElementById('menuButton').addEventListener('click', () => {
            this.shadowRoot.getElementById('menuDropdown').classList.toggle('is-active');
        });
        this.menuPluginsTcComponent = new MenuPluginsTCComponent(this);
        this.shadowRoot.getElementById('closeButton').addEventListener('click', () => this.closeButtonClick());
    }

    addItemToMenu(itemTitle) {
        const element = document.createElement('a');

        element.className = 'dropdown-item';
        element.innerHTML = itemTitle;
        element.addEventListener('click', () => this.menuItemClick(itemTitle));

        this.shadowRoot.getElementById('pluginsList').appendChild(element);
    }

    menuItemClick(itemTitle) {
        this.itemTitle = itemTitle;
        this._showCloseButton();
        this.menuPluginsTcComponent.startPlugin(this.itemTitle);
    }

    closeButtonClick() {
        this.menuPluginsTcComponent.endPlugin(this.itemTitle);
        this.showMenu();
    }

    showMenu() {
        this.shadowRoot.getElementById('closeButton').style.display = 'none';
        this.shadowRoot.getElementById('menuDropdown').style.display = 'inline-flex';
    }

    _showCloseButton() {
        this.shadowRoot.getElementById('menuDropdown').classList.toggle('is-active');
        this.shadowRoot.getElementById('menuDropdown').style.display = 'none';
        this.shadowRoot.getElementById('closeButton').style.display = 'inline-flex';
    }

    render() {
        return html`
            <button id="closeButton" class="button is-right">Fermer</button>
            <div id="menuDropdown" class="dropdown is-right">
                <div class="dropdown-trigger">
                    <button id="menuButton" class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span class="is-hidden-tablet">${unsafeHTML(icon(faCube).html[0])}</span>
                        <span class="is-hidden-mobile">Plugins ${unsafeHTML(icon(faCube).html[0])}</span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content" id="pluginsList"></div>
                </div>
            </div>
        `;
    }
}

customElements.define('tc-menu-plugins', MenuPluginsComponent);
