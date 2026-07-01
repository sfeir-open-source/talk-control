import { LitElement, html, css } from 'lit-element';
import { NotesTCComponent } from './notes-tc-component';
import { bulmaStyles } from '@compat/lit-styles-compat';

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

    firstUpdated(): void {
        new NotesTCComponent(this);
    }

    addNotes(notes: unknown): void {
        this.shadowRoot!.getElementById('notes')!.innerHTML = notes as string;
    }

    render() {
        return html` <div id="notes"></div> `;
    }
}

customElements.define('tc-notes', NotesComponent);
