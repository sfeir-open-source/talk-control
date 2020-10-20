'use strict';

const cors = require('cors');

module.exports = {
    init(app) {
        app.use(cors());
        app.use('/iframe', require('./controllers/iframe.controller'));
        app.use('*', require('./controllers/proxy.controller'));
    }
};
