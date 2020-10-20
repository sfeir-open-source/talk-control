'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    fetch('http://localhost:5002/index-iframe.html')
        .then(response => response.text())
        .then(text => {
            text = text.split('src="/').join('src="http://localhost:3000/');
            text = text.replace('</body>', `<script src="http://localhost:5000/injectScript.js"></script></body>`);
            res.send(text);
        });
});

module.exports = router;
