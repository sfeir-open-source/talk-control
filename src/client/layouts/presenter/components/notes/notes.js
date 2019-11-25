import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { LitElement, html, css } from 'lit-element';
import { NotesSlave } from './notes-slave';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';

class NotesComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyle,
            css`
                .block-title {
                    height: 2rem;
                }
                .content {
                    height: 100%;
                    padding: 0.5rem;
                    border: 3px solid black;
                }
            `
        ];
    }
    firstUpdated() {
        new NotesSlave();
        addEventListener('message', message => {
            if (!message || !message.data) {
                return;
            }
            // 'notesReceived' event is fired by the NotesSlave
            if (typeof message.data === 'object' && message.data.type === 'notesReceived') {
                this.shadowRoot.getElementById('notes').innerHTML = message.data.notes;
            }
        });
    }

    render() {
        return html`
            <div class="content">
                <div class="block-title">
                    <p class="is-size-6">NOTES</p>
                </div>
                <div id="notes"></div>
            </div>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-notes', NotesComponent);
