'use strict';

import { TalkControlMaster } from '../../talk-control-master/talk-control-master.js';
import { isUrlValid } from '@helpers/helpers.js';
import config from '@config/config.json';

window.addEventListener('DOMContentLoaded', function() {
    const inputPresentation = document.getElementById('inputPresentation');
    const validateUrl = document.getElementById('btnValidate');
    const displaySlideshow = () => {
        const url = inputPresentation.value;
        const stageFrame = document.getElementById('stageFrame');
        // If url invalid, show an error
        document.getElementById('urlError').classList.add('is-hidden');
        if (!isUrlValid(url)) {
            stageFrame.classList.add('is-hidden');
            document.getElementById('urlError').classList.remove('is-hidden');
            return;
        }

        stageFrame.src = url;
        stageFrame.classList.remove('is-hidden');
        document.getElementById('form').classList.add('is-hidden');
    };

    validateUrl.addEventListener('click', displaySlideshow);
    inputPresentation.addEventListener('keypress', e => {
        const key = e.which || e.keyCode;
        if (key === 13) {
            displaySlideshow();
        }
    });

    const talkControlMaster = new TalkControlMaster(config.tcServer.url);
    talkControlMaster.init();
});
