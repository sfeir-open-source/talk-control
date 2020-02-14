'use strict';

import { TalkControlMaster } from '../../talk-control-master/talk-control-master.js';
import config from '@config/config.json';

window.addEventListener('DOMContentLoaded', function() {
    addEventListener('url-changed', event => {
        const url = event.detail.url;
        if (url) {
            const slideViews = document.querySelectorAll('tc-slide');
            const urlForm = document.querySelector('tc-url-form');
            const presenterView = document.querySelector('#presenter-view');

            slideViews.forEach(slideView => {
                slideView.url = url;
                slideView.classList.remove('is-hidden');
            });
            urlForm.classList.add('is-hidden');
            presenterView.classList.remove('is-hidden');
        }
    });

    const isRemote = window.location.href.indexOf('://localhost:') === -1;
    const talkControlMaster = new TalkControlMaster(isRemote ? config.tcServer.urls.external : config.tcServer.urls.local);
    talkControlMaster.init();
});
