'use strict';

import express from 'express';
import http from 'http';
import { TalkControlServer } from './talk-control-server';
import config from '@config/config.json';

const app = express();
const server = http.Server(app);
const talkControlServer = new TalkControlServer(server);
talkControlServer.init('revealjs');

server.listen(config.tcServer.port);
