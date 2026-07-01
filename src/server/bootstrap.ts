import express from 'express';
import http from 'http';
import { config } from '@services/config';
import router from '@server/router';
import { TCServer } from '@server/tc-server';

export function bootstrapTcServer(): void {
    const app = express();
    router.init(app);

    const server = new http.Server(app);
    new TCServer(server).init('revealjs');

    server.listen(config.tcServer.port);
}
