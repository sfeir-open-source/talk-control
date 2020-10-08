'use strict';

require('./index.css');
require('bulma/css/bulma.min.css');
require('lit-fontawesome/css/font.css');
require('@client/web-components/slide-view/slide-view.js');
require('@client/web-components/url-form/url-form.js');
require('@client/web-components/clock/clock.js');
require('@client/web-components/timer/timer.js');
require('@client/web-components/notes/notes.js');
require('@client/web-components/menu-navigation/menu-navigation.js');
require('@client/web-components/menu-plugins/menu-plugins.js');
require('@plugins/input/touch-pointer/components/touch-pointer-settings.js');
require('@plugins/input/touch-pointer/components/touch-pointer-mask.js');

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
