'use strict';

require('./index.css');
require('bulma/css/bulma.min.css');
require('@fortawesome/fontawesome-free/js/all.min.js');
require('../web-components/url-form/url-form.js');

import config from '@config/config.json';
const QRCode = require('qrcode');

window.addEventListener('DOMContentLoaded', function() {
    if (config.tcController.urls.external) {
        QRCode.toCanvas(document.getElementById('qrCode'), config.tcController.urls.external);
        document.getElementById(
            'textCode'
        ).innerHTML = `<a href="${config.tcController.urls.external}" title="Use this url to connect to TalkControl from another device">${config.tcController.urls.external}</a>`;
    } else {
        document.getElementById('qrCodeSection').classList.add('is-hidden');
    }

    document.querySelector('tc-url-form').classList.remove('is-hidden');

    addEventListener('url-form-editing', () => {
        document.getElementById('chooseLayout').classList.add('is-hidden');
    });

    addEventListener('url-form-validated', () => {
        document.getElementById('chooseLayout').classList.remove('is-hidden');
    });
});
