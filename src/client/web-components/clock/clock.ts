import { bulmaStyles } from '@compat/lit-styles-compat';
import { LitElement, html } from 'lit-element';

class ClockComponent extends LitElement {
    clock!: Element;

    static get styles() {
        return [bulmaStyles];
    }

    firstUpdated(): void {
        this.clock = this.shadowRoot!.querySelector('#clock')!;
        this.startClock();
    }

    formatTime(time: number): string | number {
        return time ? (time < 10 ? '0' + time : time) : '00';
    }

    startClock(): void {
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
        return html` <p class="is-size-4" id="clock">00:00</p> `;
    }
}

customElements.define('tc-clock', ClockComponent);
