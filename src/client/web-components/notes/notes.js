import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import { NotesTCComponent } from './notes-tc-component';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

class NotesComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyles,
            css`
                .block-title {
                    height: 2rem;
                }
            `
        ];
    }

    firstUpdated() {
        new NotesTCComponent();
        addEventListener('message', message => {
            if (!message || !message.data) {
                return;
            }
            // 'notesReceived' event is fired by the NotesTCComponent
            if (typeof message.data === 'object' && message.data.type === 'notesReceived') {
                this.shadowRoot.getElementById('notes').innerHTML = message.data.notes;
            }
        });
    }

    render() {
        return html`
            <div id="notes"></div>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-notes', NotesComponent);
