'use strict';

import express from 'express';
import fetch from 'node-fetch';
import config from '@config/config.json';
import contextService from '@services/context';

const router = express.Router();

router.get('/', (req, res) => {
    const presentationUrl = new URL(req.query['tc-presentation-url']);
    const isRemote = contextService.isUsingRemoteUrl(presentationUrl.href);
    const controllerUrl = isRemote ? config.tcController.urls.external : config.tcController.urls.local;
    const serverUrl = isRemote ? config.tcServer.urls.external : config.tcServer.urls.local;

    fetch(presentationUrl.href)
        .then(response => response.text())
        .then(content => {
            content = setNoCaching(content);
            content = setFrontProxy(content, serverUrl);
            content = injectComponent(content, controllerUrl);
            res.cookie('tc-presentation-url', presentationUrl);
            res.send(content);
        });
});

/**
 * @param html
 */
function setNoCaching(html) {
    return html.replace(
        '<head>',
        `<head>
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />`
    );
}

/**
 * @param html
 * @param serverUrl
 */
function setFrontProxy(html, serverUrl) {
    return html.replace('<head>', `<head><base href="${serverUrl}/proxy/"/>`);
}

/**
 * @param html
 * @param controllerUrl
 */
function injectComponent(html, controllerUrl) {
    return html.replace(
        '</body>',
        `<script type="application/javascript">
            // Configure the url of the server serving the tc-component and other split shunks
            window.tcResourcePath = '${controllerUrl}/'
        </script>
        <script src="${controllerUrl}/tc-component.bundle.js"></script></body>`
    );
}

export default router;
