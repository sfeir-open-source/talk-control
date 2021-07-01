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
import { bootstrapTcController } from '@client/tc-controller/bootstrap';

window.addEventListener('DOMContentLoaded', function() {
    bootstrapTcController();
});
