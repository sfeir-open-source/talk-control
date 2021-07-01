'use strict';

import express from 'express';
import fetch from 'node-fetch';
import contextService from '@services/context';
import { config } from '@services/config';

const router = express.Router();

router.get('/', patchPresentation);

/**
 * Handle presentation patching for control
 *
 * @param {Request} req - Request
 * @param {Response} res - Response
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
 * Fixes Html by adding missing tags (html, head or body)
 *
 * @param {string} html - Document to be fixed
 * @returns {string} - Fixed document
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
 * Insert metadata to html to deny caching of the document when served
 *
 * @param {string} html - Document
 * @returns {string} - Not cached document
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
 * Redirect relative requests towards the proxy endpoint by adding a base tag
 *
 * @param {string} html - Document
 * @param {string} serverUrl - Proxy server url
 * @returns {string} - Proxy directed document
 */
function setFrontProxy(html, serverUrl) {
    return html.replace('<head>', `<head><base href="${serverUrl}/proxy/"/>`);
}

/**
 * Inject Talk Control component script in the document
 *
 * @param {string} html - Document
 * @param {string} componentUrl - Talk control component server url
 * @returns {string} - Document with talk control component script
 */
function injectComponent(html, componentUrl) {
    return html.replace(
        '</body>',
        `<script type="application/javascript">
            // Configure the url of the server serving the tc-component and other split shunks
            window.tcResourcePath = '${componentUrl}/'
        </script>
        <script src="${componentUrl}/tc-component.bundle.js"></script></body>`
    );
}

export default router;
