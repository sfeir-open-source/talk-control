'use strict';

import express from 'express';
import http from 'http';
import { TalkControlServer } from './talk-control-server';

const app = express();
const server = http.Server(app);
const talkControlServer = new TalkControlServer(server);
talkControlServer.init();

server.listen(3000, () => console.log('Listening on port 3000'));
