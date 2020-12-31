'use strict';

import express from 'express';
import fetch from 'node-fetch';
import contextService from '@services/context';
import { config } from '@services/config';

const router = express.Router();

router.get('/', patchPresentation);

/**
 * @param req
 * @param res
 */
export async function patchPresentation(req, res) {
    let presentationUrl;
    try {
        presentationUrl = new URL(req.query['tc-presentation-url']);
    } catch (e) {
        res.send('Invalid presentation URL', 400);
        return;
    }

    const isRemote = contextService.isUsingRemoteUrl(presentationUrl.href);
    const controllerUrl = isRemote ? config.tcController.urls.external : config.tcController.urls.local;
    const serverUrl = isRemote ? config.tcServer.urls.external : config.tcServer.urls.local;

    const response = await fetch(presentationUrl.href);

    if (response.status === 404) {
        res.send('Presentation not found', 404);
        return;
    }

    let content = await response.text();
    content = fixHtmlDocument(content);
    content = setNoCaching(content);
    content = setFrontProxy(content, serverUrl);
    content = injectComponent(content, controllerUrl);
    res.cookie('tc-presentation-url', presentationUrl.href);
    res.send(content);
}

/**
 * @param html
 */
function fixHtmlDocument(html) {
    let fixed = html;
    if (!fixed.includes('<html')) {
        fixed = '<html>' + fixed + '</html>';
    }
    if (!fixed.includes('<head')) {
        fixed = fixed.replace('<html>', '<html><head></head>');
    }
    if (!fixed.includes('<body')) {
        fixed = fixed.replace('</head>', '</head><body>');
        fixed = fixed.replace('</html>', '</body></html>');
    }
    return fixed;
}

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
