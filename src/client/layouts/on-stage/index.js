'use strict';

import { TCController } from '@client/tc-controller/tc-controller.js';
import config from '@config/config.json';

window.addEventListener('DOMContentLoaded', function() {
    const isRemote = window.location.href.indexOf('://localhost:') === -1;

    const tcController = new TCController(isRemote ? config.tcServer.urls.external : config.tcServer.urls.local);
    tcController.init();

    const url = sessionStorage.getItem('presentationUrl');
    if (url) {
        const slideViews = document.querySelectorAll('tc-slide');
        slideViews.forEach(slideView => (slideView.url = url));
    }
});
