import express from 'express';
import http from 'http';
import config from '@config/config.json';
import router from '@server/router';
import { TCServer } from '@server/tc-server';

/**
 *
 */
export function bootstrapTcServer() {
    const app = express();
    router.init(app);

    const server = http.Server(app);
    new TCServer(server).init('revealjs');

    server.listen(config.tcServer.port);
}
