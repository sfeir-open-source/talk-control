import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html } from 'lit-element';

class ClockComponent extends LitElement {
    static get styles() {
        return [bulmaStyles];
    }

    firstUpdated() {
        this.clock = this.shadowRoot.querySelector('#clock');
        this.startClock();
    }

    formatTime(time) {
        return time ? (time < 10 ? '0' + time : time) : '00';
    }

    startClock() {
        const updateTime = () => {
            const today = new Date();
            const hours = today.getHours();
            const minutes = today.getMinutes();
            this.clock.textContent = `${this.formatTime(hours)}:${this.formatTime(minutes)}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    render() {
        return html`
            <p class="is-size-4" id="clock">00:00</p>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-clock', ClockComponent);
