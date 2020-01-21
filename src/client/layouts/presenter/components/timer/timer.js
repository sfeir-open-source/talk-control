import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import bulmaStyle from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html, css } from 'lit-element';
import { TimerSlave } from './timer-slave';
class TimerComponent extends LitElement {
    static get styles() {
        return [
            bulmaStyle,
            css`
                #timer {
                    cursor: pointer;
                    user-select: none;
                }
                .block-title {
                    margin-top: 0.5rem;
                    height: 1rem;
                }
            `
        ];
    }

    constructor() {
        super();
        this.timerElement = {};
        this.clockElement = {};
        this.restartTimer = () => undefined;
    }

    firstUpdated() {
        // Instantiate the slave that will receive events from the master
        new TimerSlave();
        // Initialize clock and timer
        this.timerElement = this.shadowRoot.querySelector('#timer');
        this.clockElement = this.shadowRoot.querySelector('#clock');
        this.startClock();

        addEventListener('message', message => {
            if (!message || !message.data) {
                return;
            }
            // 'initTimer' event is fired by the TimerSlave
            if (typeof message.data === 'object' && message.data.type === 'initTimer') {
                this.restartTimer = this.startTimer();
            }
        });
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

    handleTimerClick() {
        this.restartTimer();
        this.restartTimer = this.startTimer();
    }

    /****** CLOCK FUNCTIONS ******/
    startClock() {
        const updateTime = () => {
            const today = new Date();
            const hours = today.getHours();
            const minutes = today.getMinutes();
            this.clockElement.textContent = `${this.formatTime(hours)}:${this.formatTime(minutes)}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    render() {
        return html`
            <div class="block-title">
                <p class="is-size-6">TIMER</p>
            </div>
            <div class="columns is-mobile is-paddingless is-marginless">
                <div class="column is-paddingless">
                    <p class="is-size-3 is-unselectable" id="timer" @click="${this.handleTimerClick}">00:00:00</p>
                </div>
                <div class="column has-text-right is-paddingless" style="padding-right: 1.5rem;">
                    <p class="is-size-3 is-unselectable" id="clock">00:00</p>
                </div>
            </div>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-timer', TimerComponent);
