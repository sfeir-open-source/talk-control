'use strict';

import config from '@config/config.json';
const QRCode = require('qrcode');

window.addEventListener('DOMContentLoaded', function() {
    if (config.tcMaster.urls.external) {
        QRCode.toCanvas(document.getElementById('qrCode'), config.tcMaster.urls.external);
        document.getElementById(
            'textCode'
        ).innerHTML = `<a href="${config.tcMaster.urls.external}" title="Use this url to connect to TalkControl from another device">${config.tcMaster.urls.external}</a>`;
    }
});
