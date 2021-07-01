'use strict';

import './index.css';
import 'bulma/css/bulma.min.css';
import 'lit-fontawesome/css/font.css';
import '@client/web-components/slide-view/slide-view.js';
import '@client/web-components/loader/loader.js';
import '@client/web-components/magic-info/magic-info.js';
import '@client/web-components/url-form/url-form.js';
import '@client/web-components/clock/clock.js';
import '@client/web-components/timer/timer.js';
import '@client/web-components/notes/notes.js';
import '@client/web-components/menu-navigation/menu-navigation.js';
import '@client/web-components/menu-plugins/menu-plugins.js';
import '@plugins/input/touch-pointer/components/touch-pointer-settings.js';
import '@plugins/input/touch-pointer/components/touch-pointer-mask.js';
import { bootstrapTcController } from '@client/tc-controller/bootstrap';

window.addEventListener('DOMContentLoaded', function() {
    bootstrapTcController();
});
