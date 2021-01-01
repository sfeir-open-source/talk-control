import express from 'express';
import http from 'http';
import { config } from '@services/config';
import router from '@server/router';
import { TCServer } from '@server/tc-server';

/**
 * Bootstraps Talk Control Server
 */
export function bootstrapTcServer() {
    const app = express();
    router.init(app);

    const server = http.Server(app);
    new TCServer(server).init('revealjs');

    server.listen(config.tcServer.port);
}
