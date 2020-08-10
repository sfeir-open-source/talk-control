import { TCComponent } from '@client/tc-component/tc-component.js';

export class TimerSlave extends TCComponent {
    init() {
        postMessage({ type: 'initTimer' });
    }
}
