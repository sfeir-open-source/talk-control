'use strict';

import { TalkControlMaster } from '../../talk-control-master/talk-control-master.js';
import { isUrlValid } from '@helpers/helpers.js';

window.addEventListener('DOMContentLoaded', function() {
    const inputPresentation = document.getElementById('inputPresentation');
    const validateUrl = document.getElementById('btnValidate');
    const displaySlideshow = () => {
        const url = inputPresentation.value;
        const presenterview = document.getElementById('presenter-view');
        const currentSlide = document.getElementById('current-slide');
        const nextSlide = document.getElementById('next-slide');
        // If url invalid, show an error
        document.getElementById('urlError').classList.add('is-hidden');
        if (!isUrlValid(url)) {
            presenterview.classList.add('is-hidden');
            document.getElementById('urlError').classList.remove('is-hidden');
            return;
        }

        currentSlide.src = url;
        nextSlide.src = url + '#delta=1';
        presenterview.classList.remove('is-hidden');
        document.getElementById('form').classList.add('is-hidden');
    };

    validateUrl.addEventListener('click', displaySlideshow);
    inputPresentation.addEventListener('keypress', e => {
        const key = e.which || e.keyCode;
        if (key === 13) {
            displaySlideshow();
        }
    });

    const talkControlMaster = new TalkControlMaster('http://localhost:3000');
    talkControlMaster.init();
});
