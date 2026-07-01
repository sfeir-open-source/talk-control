import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import patcher from '@server/controllers/patcher.controller';
import proxy from '@server/controllers/proxy.controller';

/**
 * Creates a test Express app with patcher and proxy routes mounted.
 *
 * @returns {express.Application} Configured Express application for testing
 */
export function createTestApp(): express.Application {
    const app = express();
    app.use(cors());
    app.use(cookieParser());
    app.use('/patcher', patcher);
    app.use('/proxy', proxy);
    return app;
}
