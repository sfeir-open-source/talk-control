import { bulmaStyles } from '@compat/lit-styles-compat';
import { LitElement, html, css } from 'lit-element';
import { TimerTCComponent } from './timer-tc-component';

class TimerComponent extends LitElement {
    timerElement!: Element;
    restartTimer: () => void = () => undefined;

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

    firstUpdated(): void {
        new TimerTCComponent(this);
        this.timerElement = this.shadowRoot!.querySelector('#timer')!;
    }

    formatTime(time: number): string | number {
        return time ? (time < 10 ? '0' + time : time) : '00';
    }

    startTimer(): () => void {
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

    reset(): void {
        this.restartTimer();
        this.restartTimer = this.startTimer();
    }

    render() {
        return html` <div class="is-size-3 is-unselectable" id="timer" @click="${this.reset}">00:00:00</div> `;
    }
}

customElements.define('tc-timer', TimerComponent);
