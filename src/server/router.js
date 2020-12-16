'use strict';

import cors from 'cors';
import patcher from './controllers/patcher.controller';
import proxy from './controllers/proxy.controller';
import cookieParser from 'cookie-parser';

export default {
    init(app) {
        app.use(cors());
        app.use(cookieParser());
        app.use('/patcher', patcher);
        app.use('/proxy', proxy);
    }
};
