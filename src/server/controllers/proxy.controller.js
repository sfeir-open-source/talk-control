'use strict';

import express from 'express';
import httpProxy from 'http-proxy';

const router = express.Router();
const proxy = httpProxy.createProxyServer();

router.all('*', (req, res) => {
    const presentationUrl = req.cookies && req.cookies['tc-presentation-url'];
    if (presentationUrl) {
        req.url = req.originalUrl.replace('/proxy', '');
        const target = new URL(presentationUrl).origin;
        proxy.web(req, res, { target, secure: false });
    }
});

export default router;
