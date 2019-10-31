'use strict';

import { TalkControlMaster } from './talk-control-master.js';

window.addEventListener('DOMContentLoaded', function() {
    console.log('ready');
    const talkControlMaster = new TalkControlMaster();
    talkControlMaster.init();
});
