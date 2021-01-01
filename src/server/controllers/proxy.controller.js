'use strict';

import express from 'express';
import httpProxy from 'http-proxy';

const router = express.Router();
const proxy = httpProxy.createProxyServer();

router.all('*', (req, res) => forwardTraffic(req, res, proxy));

/**
 * @param req
 * @param res
 * @param proxy
 */
export function forwardTraffic(req, res, proxy) {
    const presentationUrl = req.cookies && req.cookies['tc-presentation-url'];
    let target;
    try {
        target = new URL(presentationUrl).origin;
    } catch (e) {
        res.send('Invalid presentation URL', 400);
        return;
    }

    req.url = req.originalUrl.replace('/proxy', '');
    proxy.web(req, res, { target, secure: false });
}

export default router;
