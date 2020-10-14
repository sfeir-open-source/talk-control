'use strict';

import 'bulma/css/bulma.min.css';
import 'lit-fontawesome/css/font.css';
import './index.css';
import '@client/web-components/slide-view/slide-view.js';
import '@client/web-components/url-form/url-form.js';
import '@client/web-components/clock/clock.js';
import '@client/web-components/timer/timer.js';
import '@client/web-components/notes/notes.js';
import '@client/web-components/menu-navigation/menu-navigation.js';
import '@client/web-components/menu-plugins/menu-plugins.js';
import '@plugins/input/touch-pointer/components/touch-pointer-settings.js';
import '@plugins/input/touch-pointer/components/touch-pointer-mask.js';

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
