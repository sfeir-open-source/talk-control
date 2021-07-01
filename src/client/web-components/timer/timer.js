import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html, css } from 'lit-element';
import { TimerTCComponent } from './timer-tc-component';

class TimerComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyles,
            css`
                #timer {
                    cursor: pointer;
                    user-select: none;
                }
            `
        ];
    }

    constructor() {
        super();
        this.timerElement = {};
        this.restartTimer = () => undefined;
    }

    firstUpdated() {
        new TimerTCComponent(this);
        this.timerElement = this.shadowRoot.querySelector('#timer');
    }

    formatTime(time) {
        return time ? (time < 10 ? '0' + time : time) : '00';
    }

    startTimer() {
        let seconds = 0,
            minutes = 0,
            hours = 0;
        const add = () => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
            this.timerElement.textContent = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
        };
        const intervalID = setInterval(add, 1000);
        return () => {
            clearInterval(intervalID);
            seconds = 0;
            minutes = 0;
            hours = 0;
            this.timerElement.textContent = '00:00:00';
        };
    }

    reset() {
        this.restartTimer();
        this.restartTimer = this.startTimer();
    }

    render() {
        return html`
            <div class="is-size-3 is-unselectable" id="timer" @click="${this.reset}">00:00:00</div>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-timer', TimerComponent);
