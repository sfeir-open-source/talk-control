'use strict';

import 'bulma/css/bulma.min.css';
import 'lit-fontawesome/css/font.css';
import './index.css';
import '@client/web-components/slide-view/slide-view.js';
import '@client/web-components/loader/loader.js';
import '@client/web-components/magic-info/magic-info.js';
import '@client/web-components/clock/clock.js';
import '@client/web-components/menu-navigation/menu-navigation.js';
import '@client/web-components/menu-plugins/menu-plugins.js';

import { TCController } from '@client/tc-controller/tc-controller.js';
import config from '@config/config.json';
import contextService from '@services/context';

window.addEventListener('DOMContentLoaded', function() {
    const isRemote = contextService.isUsingRemoteUrl(window.location.href);
    const tcServerUrl = isRemote ? config.tcServer.urls.external : config.tcServer.urls.local;

    new TCController(tcServerUrl).init();
});
