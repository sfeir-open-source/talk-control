import { TalkControlSlave } from '@client/talk-control-slave/talk-control-slave.js';

export class TimerSlave extends TalkControlSlave {
    init() {
        postMessage({ type: 'initTimer' });
    }
}
