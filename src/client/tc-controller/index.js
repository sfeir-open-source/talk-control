'use strict';

import 'bulma/css/bulma.min.css';
import 'lit-fontawesome/css/font.css';
import './index.css';
import '@client/web-components/url-form/url-form.js';
import '@client/web-components/view-selector/view-selector';
import '@client/web-components/remote-control/remote-control';

window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('tc-url-form').classList.remove('is-hidden');

    addEventListener('url-form-editing', () => {
        document.getElementById('chooseLayout').classList.add('is-hidden');
    });

    addEventListener('url-form-validated', () => {
        document.getElementById('chooseLayout').classList.remove('is-hidden');
    });
});
