// Import the LitElement base class and html helper function
import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { MenuPluginsTCComponent } from './menu-plugins-tc-component';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html } from 'lit-element';

// Extend the LitElement base class
class MenuPlugins extends LitElement {
    static get properties() {
        return {};
    }

    static get styles() {
        return [
            bulmaStyle
        ];
    }

    constructor() {
        super();
        this.menuPluginsTcComponent;
    }

    firstUpdated() {
        super.firstUpdated();
        this.shadowRoot.getElementById('menuButton').addEventListener('click', () => {
            this.shadowRoot.getElementById('menuDropdown').classList.toggle('is-active');
        });
        this.menuPluginsTcComponent = new MenuPluginsTCComponent();
        this.menuPluginsTcComponent.init(pluginName => this.addItemToMenu('pluginsList', pluginName));
    }

    addItemToMenu(menuTagName, itemTitle) {
        const element = document.createElement('a');

        element.className = 'dropdown-item';
        element.innerHTML = itemTitle;
        element.addEventListener('click', () => this.itemClick(itemTitle));

        this.shadowRoot.getElementById(menuTagName).appendChild(element);
    }

    itemClick(itemTitle) {
        this.menuPluginsTcComponent.startPlugin(itemTitle);
    }

    render() {
        return html`
            <div id="menuDropdown" class="dropdown is-right">
                <div class="dropdown-trigger">
                    <button id="menuButton" class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span class="is-hidden-tablet">P</span>
                        <span class="is-hidden-mobile">Plugins</span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content" id="pluginsList"></div>
                </div>
            </div>
        `;
    }
}
// Register the new element with the browser.
customElements.define('tc-menu-plugins', MenuPlugins);