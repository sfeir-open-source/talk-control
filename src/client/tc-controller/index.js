'use strict';

require('./index.css');
require('bulma/css/bulma.min.css');
require('lit-fontawesome/css/font.css');
require('@client/web-components/url-form/url-form.js');
require('@client/web-components/view-selector/view-selector');
require('@client/web-components/remote-control/remote-control');

window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('tc-url-form').classList.remove('is-hidden');

    addEventListener('url-form-editing', () => {
        document.getElementById('chooseLayout').classList.add('is-hidden');
    });

    addEventListener('url-form-validated', () => {
        document.getElementById('chooseLayout').classList.remove('is-hidden');
    });
});
