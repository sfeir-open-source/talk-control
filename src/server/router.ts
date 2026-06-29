import cors from 'cors';
import patcher from './controllers/patcher.controller';
import proxy from './controllers/proxy.controller';
import cookieParser from 'cookie-parser';
import { Express } from 'express';

export default {
    init(app: Express): void {
        app.use(cors());
        app.use(cookieParser());
        app.use('/patcher', patcher);
        app.use('/proxy', proxy);
    }
};
