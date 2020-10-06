'use strict';

require('./index.css');
require('bulma/css/bulma.min.css');
require('@fortawesome/fontawesome-free/js/all.min.js');
require('../../web-components/slide-view/slide-view.js');
require('../../web-components/clock/clock.js');
require('../../web-components/menu-navigation/menu-navigation.js');
require('../../web-components/menu-plugins/menu-plugins.js');

import { TCController } from '@client/tc-controller/tc-controller.js';
import config from '@config/config.json';
import contextService from '@services/context';

window.addEventListener('DOMContentLoaded', function() {
    const isRemote = contextService.isUsingRemoteUrl(window.location.href);

    const tcController = new TCController(isRemote ? config.tcServer.urls.external : config.tcServer.urls.local);
    tcController.init();

    const url = sessionStorage.getItem('presentationUrl');
    if (url) {
        const slideViews = document.querySelectorAll('tc-slide');
        slideViews.forEach(slideView => (slideView.url = url));
    }
});
