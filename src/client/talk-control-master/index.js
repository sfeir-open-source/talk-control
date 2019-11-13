'use strict';

import { TalkControlMaster } from './talk-control-master.js';

window.addEventListener('DOMContentLoaded', function() {
    const talkControlMaster = new TalkControlMaster('http://localhost:3000');
    talkControlMaster.init();
});
