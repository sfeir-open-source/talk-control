'use strict';

import express from 'express';
import http from 'http';
import { TCServer } from './tc-server';
import config from '@config/config.json';
import router from './router';

const app = express();
router.init(app);

const server = http.Server(app);
const tcServer = new TCServer(server);
tcServer.init('revealjs');

server.listen(config.tcServer.port);
