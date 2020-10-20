'use strict';

const express = require('express');
const router = express.Router();

const proxy = require('http-proxy').createProxyServer({
    host: 'http://localhost',
    port: 3002
});

router.all('*', (req, res, next) => {
    console.log('Proxing url', req.originalUrl);
    if (req.originalUrl !== '/iframeFull' && req.originalUrl !== '/iframe') {
        proxy.web(
            req,
            res,
            {
                target: 'http://localhost:3002'
            },
            next
        );
    }
});

module.exports = router;
