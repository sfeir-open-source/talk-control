import { TCComponent } from '@client/tc-component/tc-component.js';

export class TimerTCComponent extends TCComponent {
    init() {
        postMessage({ type: 'initTimer' });
    }
}
