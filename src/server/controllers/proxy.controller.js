'use strict';

const router = require('express').Router();
const proxy = require('http-proxy').createProxyServer({
    target: 'http://localhost:3002'
});

router.all('*', (req, res) => {
    console.log('Proxing url', req.originalUrl);
    if (req.originalUrl !== '/iframe') {
        req.url = req.originalUrl;
        proxy.web(req, res);
    }
});

module.exports = router;
