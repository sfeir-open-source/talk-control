'use strict';

const express = require('express');
const router = express.Router();

const proxy = require('http-proxy').createProxyServer({
    host: 'http://localhost',
    port: 5002
});

router.all('*', (req, res, next) => {
    console.log(req.originalUrl);
    if (req.originalUrl !== '/iframeFull' && req.originalUrl !== '/iframe') {
        proxy.web(
            req,
            res,
            {
                target: 'http://localhost:5002'
            },
            next
        );
    }
});

module.exports = router;
